import React, { Component } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const imageMaxSize = 20000000; // bytes
const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
  return item.trim();
});

class ImageUpload extends Component {
  state = {
    image: this.props.image,
    crop: {
      aspect: 0.7,
      minWidth: 300,
      minHeight: 300,
      x: 50,
      y: 50,
      wigth: 50,
    },
    pixelCrop: {
      aspect: 0.7,
      minWidth: 300,
      minHeight: 300,
      x: 50,
      y: 50,
      wigth: 50,
    },
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ image: nextProps.image });
  }

  verifyFile = (files) => {
    if (files && files.length > 0) {
      if (files.length > 1) {
        alert("Możesz dodać tylko jeden plik.");
        return false;
      }

      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert("Zbyt duży plik.");
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert(
          "Ten typ pliku nie jest obsługiwany. Dodaj .jpg, .jpeg lub .png :) "
        );
        return false;
      }
      return true;
    }
  };

  handleCrop = (e) => {
    e.preventDefault();
    this.getCroppedImg(this.state.image, this.state.pixelCrop)
      .then((pic) => {
        this.setState({ image: pic });
        this.setState({ pixelCrop: null });
        this.setState({
          crop: {
            aspect: 0.7,
            minWidth: 300,
            minHeight: 300,
            x: 50,
            y: 50,
            wigth: 50,
          },
        });
        this.props.submitCrop(pic);
      })
      .catch((e) => {
        console.log(e.message);
        alert(e.message);
      });
  };

  handleOnDrop = (files) => {
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener("load", () => {
          const result = myFileItemReader.result;
          this.setState({ image: result });
        });
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  getCroppedImg = (imageData, crop) => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageData;
    return new Promise((resolve, reject) => {
      try {
        image.onload = () => {
          const cropWidth = (image.width * crop.width) / 100;
          const cropHeight = (image.height * crop.height) / 100;
          const cropX = (image.width * crop.x) / 100;
          const cropY = (image.width * crop.y) / 100;

          canvas.width = cropWidth;
          canvas.height = cropHeight;
          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );

          const base64Image = canvas.toDataURL("image/jpeg");
          resolve(base64Image);
        };
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  };

  render() {
    return (
      <div>
        {this.state.image ? (
          <div>
            <ReactCrop
              src={this.state.image}
              crop={this.state.crop}
              onComplete={(e, crop) => {
                this.setState({ pixelCrop: crop });
              }}
              onChange={(x) => this.setState({ crop: x })}
              imageStyle={{ height: 400, width: "auto" }}
            />
            <div>
              <button
                className="btn btn-danger"
                onClick={() => this.setState({ image: null })}
              >
                Zmień zdjęcie
              </button>
              <button
                className="btn btn-danger"
                style={{ marginLeft: 20 }}
                onClick={this.handleCrop}
              >
                Przytnij
              </button>
            </div>
          </div>
        ) : (
          <Dropzone onDrop={this.handleOnDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone clickable">
                  Przeciągnij zdjęcie lub kliknij tutaj i wybierz je z plików.
                </div>
              </div>
            )}
          </Dropzone>
        )}
      </div>
    );
  }
}

export default ImageUpload;
