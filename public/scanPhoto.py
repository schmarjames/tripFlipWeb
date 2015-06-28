import os, sys, urllib, cStringIO
from PIL import Image
sys.path.append('/usr/local/lib/python2.7/site-packages')
import cv2 
import numpy as np
from matplotlib import pyplot as plt

#face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier('/usr/local/Cellar/opencv/2.4.11_1/share/OpenCV/haarcascades/haarcascade_frontalface_default.xml');
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

def createImage(url):
    file = urllib.urlopen(url)
    arr = np.asarray(bytearray(file.read()), dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR);


def detectFace(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)
    return len(faces);

def detectText(img):
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY) # grayscale
    _,thresh = cv2.threshold(gray,150,255,cv2.THRESH_BINARY_INV) # threshold
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS,(3,3))
    dilated = cv2.dilate(thresh,kernel,iterations = 13) # dilate
    contours, hierarchy = cv2.findContours(dilated,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    #for contour in contours:
        # get rectangle bounding contour
    #        [x,y,w,h] = cv2.boundingRect(contour)

            # discard areas that are too large
    #        if h>300 and w>300:
    #            continue

            # discard areas that are too small
    #        if h<40 or w<40:
    #            continue

            # draw rectangle around contour on original image
    #        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,255),2)
    #cv2.imshow('img',img)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()
    return len(contours)

detect = 0
img = createImage(sys.argv[1]);

if (detectFace(img) == 0) and (detectText(img) < 2):
    print 1
else:
    print 0

#os.system("/usr/bin/php ../app/Console/Commands/PhotoFilter.php faces")
#for (x,y,w,h) in faces:
#    cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)

#    roi_gray = gray[y:y+h, x:x+w]
#    roi_color = img[y:y+h, x:x+w]
#    eyes = eye_cascade.detectMultiScale(roi_gray)
#    for (ex,ey,ew,eh) in eyes:
#        cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)

#cv2.imshow('img',img)
#cv2.waitKey(0)
#cv2.destroyAllWindows()

#plt.imshow(img, cmap='gray', interpolation='bicubic')
#plt.xticks([]), plt.yticks([]) # to hide tick values on X and Y axis
#plt.show()
