<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\TemporaryPasswords;
use JWTAuth;
use Tymon\JWTAuth\Exception\JWTException;

class AuthenticateController extends Controller
{

  public function adminAuth(Request $request) {
    \Config::set('auth.model', 'App\AdminUsers');
    //var_dump($request->url()); die();
    $credentials = $request->only('email', 'password');

    try {
      if (! $token = JWTAuth::attempt($credentials)) {
        return response()->json(['error' => 'invalid_credentials'], 401);
      }
    } catch (JWTException $e) {
      return response()->json(['error' => 'invalid_credentials']);
    }

    return response()->json(compact('token'));
  }

  public function auth(Request $request) {
    \Config::set('auth.model', 'App\User');
    $credentials = $request->only('email', 'password');
    //var_dump($credentials); die();
    try {
      if (! $token = JWTAuth::attempt($credentials)) {
        return response()->json(['error' => 'invalid_credentials'], 401);
      }
    } catch (JWTException $e) {
      return response()->json(['error' => 'invalid_credentials']);
    }

    return response()->json(compact('token'));
  }

  public function authRegister(Request $request) {
    $data = $request->only('name', 'email', 'password', 'address', 'city', 'zipCode', 'country', 'stateRegion', 'avatarSource', 'lat', 'lng');

    $newUser = User::create([
      "name" => $data["name"],
      "email" => $data["email"],
      "password" => bcrypt($data["password"]),
      "address" => $data["address"],
      "city" => $data["city"],
      "state_region" => $data["stateRegion"],
      "country" => $data["country"],
      "zip_code" => $data["zipCode"],
      "profile_pic" => $data["avatarSource"],
      "geo" => json_encode(["lat" => $data["lat"], "lng" => $data["lng"]]),
      "notifications_active" => 1
      ]);

    if(!is_null($newUser)) {
      return response()->json(["token" => JWTAuth::fromUser($newUser), "userData" => $newUser]);
    }

    return response()->json($newUser);
  }

  public function getAuthenticatedUser(Request $request) {
    if (!!$request->input('mobile')) {
      \Config::set('auth.model', 'App\User');
    } else {
      \Config::set('auth.model', 'App\AdminUsers');
    }
    try {
      if (!$user = JWTAuth::parseToken()->authenticate()) {
        return response()->json(['user_not_found'], 404);
      }
    } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
      return response()->json(['token_expired'], $e->getStatusCode());
    } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
      return response()->json(['token_invalid'], $e->getStatusCode());
    } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
      return response()->json(['token_absent'], $e->getStatusCode());
    }

    return response()->json(compact('user'));
  }

  public function assignTemporaryPassword(Request $request) {
    \Config::set('auth.model', 'App\User');
    $email = $request->only('email');

    $user = User::where('email', $email)->first();

    if (!is_null($user)) {
        if($rand_password = $this->generatePassword(8)) {
          TemporaryPasswords::where('user_id', $user->id)->delete();
          TemporaryPasswords::create([
            "user_id" => $user->id,
            "temporary_passwords" => bcrypt($rand_password)
            ]);

          // Send email to notify user of temp password
          $message = sprintf("Hello %s, \n Your temporary password for you account is %s. Use this password to reset your accounts password. This temporary password will expire in 10 minutes.",
            $user->name,
            $rand_password
          );

          \Mail::raw($message, function($m) use ($user) {
            $m->sender("loyd.slj@gmail.com", "TripFlip");
            $m->to($user->email, $user->name)->subject('Your Account Temporary Password');
          });
          return response()->json(["success" => 1, "message" => "Check your email for temporary password. Use it to reset your account password."]);
        }
        return response()->json(["success" => 0, "message" => "There has been an issue with assigning you a temporary password."]);
    }

    return response()->json(["success" => 0, "message" => "This email is not recognized."]);
  }

  public function changeUserCredentials(Request $request) {
    \Config::set('auth.model', 'App\User');
    $data = $request->only('email', 'tempPassword', 'newPassword', 'repeatNewPassword');

    // see if user exist
    $user = User::where('email', $data["email"])->first();
    if($user) {

      // check temp password existence
      $temp_pass = TemporaryPasswords::where('user_id', $user->id)->first()->temporary_passwords;
      if ($temp_pass) {
        if (\Hash::check($data["tempPassword"], $temp_pass)) {

          // check to see if newPassword and repeat pass match
          if ($data["newPassword"] === $data["repeatNewPassword"]) {
            $user->password = bcrypt($data["newPassword"]);
            $user->save();
            return response()->json(["success" => 1, "message" => "Your credentials have been changed."]);
          }
        }
      }
      return response()->json(["success" => 0, "message" => "This temporary password is not recognized or probably has expired."]);
    }
    return response()->json(["success" => 0, "message" => "This email is not recognized."]);
  }

  public function changeUserProfileSettings(Request $request) {
    $user = \JWTAuth::parseToken()->authenticate();
    $data = \Input::all();

    if ($data['type'] == 'profile') {
        $userData = $data['data'];
        $entry = User::where('id', $user->id)
          ->update([
              'name' => $userData['name'],
              'email' => $userData['email'],
              'address' => $userData['address'],
              'city' => $userData['city'],
              'zip_code' => $userData['zipCode'],
              'country' => $userData['country'],
              'state_region' => $userData['stateRegion'],
              'profile_pic' => $userData['avatarSource']
            ]);
        $user->name = $userData['name'];
        $user->email = $userData['email'];
        $user->address = $userData['address'];
        $user->city = $userData['city'];
        $user->zip_code = $userData['zipCode'];
        $user->country = $userData['country'];
        $user->state_region = $userData['stateRegion'];
        $user->profile_pic = $userData['avatarSource'];
        $entry = $user->save();

        if (!is_null($entry)) {
          return response()->json($this->_sendUserData());
        } else {
          return response()->json(0);
        }
    }

    else if ($data['type'] == 'password') {
      $passwordData = $data['data'];
      if (password_verify($passwordData['currentPassword'], $user->password)) {
          if ($passwordData['newPassword'] == $passwordData['repeatNewPassword']) {
            $user->password = bcrypt($passwordData['newPassword']);
            $entry = $user->save();

            if (!is_null($entry)) {
              return response()->json($this->_sendUserData());
            } else {
              return response()->json(0);
            }
          }
      }

      return response()->json(0);
    }

  }

  protected function _sendUserData() {
    \Config::set('auth.model', 'App\User');
    try {
      if (!$user = JWTAuth::parseToken()->authenticate()) {
        return response()->json(['user_not_found'], 404);
      }
    } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
      return response()->json(['token_expired'], $e->getStatusCode());
    } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
      return response()->json(['token_invalid'], $e->getStatusCode());
    } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
      return response()->json(['token_absent'], $e->getStatusCode());
    }

    return compact('user');
  }

  protected function generatePassword($length) {
    return substr(preg_replace("/[^a-zA-Z0-9]/", "", base64_encode($this->getRandomBytes($length+1))), 0, $length);
  }

  protected function getRandomBytes($nbBytes = 8) {
    $strong = true;
    $bytes = openssl_random_pseudo_bytes($nbBytes, $strong);
    if($bytes !== false) {
      return $bytes;
    } else {
      throw new \Exception("Unable to generate secure token from OpenSSL");
    }
  }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
