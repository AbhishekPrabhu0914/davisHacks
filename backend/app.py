import os
from flask import Flask, request, render_template_string, flash, redirect, url_for
from werkzeug.utils import secure_filename
from PIL import Image

from flask_cors import CORS


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'super secret key'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
  return '.' in filename and \
         filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

HTML_FORM = '''
<!doctype html>
<title>Upload and Open Image</title>
<h1>Upload an Image</h1>
{% with messages = get_flashed_messages(with_categories=true) %}
  {% if messages %}
    <ul class=flashes>
    {% for category, message in messages %}
      <li class="{{ category }}">{{ message }}</li>
    {% endfor %}
    </ul>
  {% endif %}
{% endwith %}
<form method=post enctype=multipart/form-data>
  <input type=file name=file>
  <input type=submit value=Upload>
</form>
<style>
  .error { color: red; }
  .success { color: green; }
</style>
'''

HTML_RESULT = '''
<!doctype html>
<title>Upload Result</title>
<h1>Image Uploaded and Opened</h1>
<p>Filename: {{ filename }}</p>
<p>Saved to: {{ filepath }}</p>
{% if image_info %}
  <h2>Image Info (from Pillow):</h2>
  <p>Format: {{ image_info.format }}</p>
  <p>Mode: {{ image_info.mode }}</p>
  <p>Size: {{ image_info.size[0] }} x {{ image_info.size[1] }} pixels</p>
{% endif %}
<br>
<a href="{{ url_for('upload_image') }}">Upload another image</a>
'''

@app.route('/upload', methods=['GET', 'POST'])
def upload_image():
  if request.method == 'POST':
    if 'file' not in request.files:
      flash('No file part in the request.', 'error')
      return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
      flash('No selected file.', 'error')
      return redirect(request.url)

    if file and allowed_file(file.filename):
      filename = secure_filename(file.filename)
      filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

      try:
        file.save(filepath)
        flash(f'File "{filename}" uploaded successfully.', 'success')

        img = Image.open(filepath)
        image_info = {
            'format': img.format,
            'mode': img.mode,
            'size': img.size
        }
        img.close()

        return render_template_string(HTML_RESULT,
                                        filename=filename,
                                        filepath=filepath,
                                        image_info=image_info)

      except Exception as e:
        flash(f'An error occurred: {e}', 'error')
        if os.path.exists(filepath):
             os.remove(filepath)
        return redirect(request.url)

    else:
      flash('Invalid file type. Allowed types: png, jpg, jpeg, gif', 'error')
      return redirect(request.url)

  return render_template_string(HTML_FORM)

if __name__ == '__main__':
  app.run(debug=True)