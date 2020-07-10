# coding=utf-8
from __future__ import division, print_function
import sys
import os
import glob
import re
import numpy as np
import wikipedia

# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image

# Flask utils
from flask import Flask, redirect, url_for, request, render_template,jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)

# Model Path
MODEL_PATH = 'models/resNet_model.h5'

# Loading trained model
try:
    model = load_model(MODEL_PATH)
    model._make_predict_function()          
    print('Model loaded')
except:
    print('Error! Model not loaded.')


def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))
    # Preprocessing the image
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x, mode='caffe')
    preds = model.predict(x)
    return preds


@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        try:
            # Get the file from post request
            f = request.files['file']

            # Save the file to ./uploads
            basepath = os.path.dirname(__file__)
            file_path = os.path.join(
                basepath, 'uploads', secure_filename(f.filename))
            f.save(file_path)

            # Make prediction
            preds = model_predict(file_path, model)

            # Process result for human
            # pred_class = preds.argmax(axis=-1)            # Simple argmax
            pred_class = decode_predictions(preds, top=3)   # ImageNet Decode
            classes=[]
            for c in pred_class[0]:
                classes.append({'name':c[1].replace('_',' '),'probability':"{:.2f}".format(c[2]*100),
                                'summary':wikipedia.summary(c[1].replace('_',' '))})
            return jsonify(classes)
        except:
            return 'Something went wrong!'                 
    return None


if __name__ == '__main__':
	app.run(debug=True)

