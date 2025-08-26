import React, { Component } from 'react';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
// Rimosse integrazioni API/FaceRecognition

import './App.css';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import { detectFaces, detectFacesBase64, recognizeColors, recognizeColorsBase64 } from './services/apiService';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      isLoading: false,
      boxes: [],
      route: 'home',
      isSignedIn: true,
      user: {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        entries: 0,
        joined: new Date().toISOString()
      },
      facesData: [],
      colorData: [],
      localDataUrl: ''
    };
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(error => console.error('Error:', error));
  // }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = async () => {
    const { input } = this.state;
    if (!input) return;
    this.setState({ isLoading: true, imageUrl: input, boxes: [], facesData: [], colorData: [] });
    try {
      const [{ regions }, { colors }] = await Promise.all([
        detectFaces(input),
        recognizeColors(input)
      ]);
      // Aggiorna sempre i colori
      this.setState({ colorData: colors });
      const img = document.getElementById('inputimage');
      if (img && regions.length > 0) {
        const width = img.width;
        const height = img.height;
        const boxes = regions.map(r => {
          const b = r.region_info.bounding_box;
          return {
            leftCol: b.left_col * width,
            topRow: b.top_row * height,
            rightCol: b.right_col * width,
            bottomRow: b.bottom_row * height
          };
        });
        const facesData = regions.map(r => r.data?.concepts?.[0]).filter(Boolean);
        this.setState({ boxes, facesData });
        this.incrementEntries();
      } else {
        this.setState({ boxes: [], facesData: [] });
      }
    } catch (error) {
      console.error('Errore rilevamento facce:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      this.setState({ localDataUrl: dataUrl, imageUrl: dataUrl, boxes: [], facesData: [] });
    };
    reader.readAsDataURL(file);
  };

  incrementEntries = () => {
    this.setState(prev => ({ 
      user: { ...prev.user, entries: prev.user.entries + 1 } 
    }));
  };

  onLocalDetect = async () => {
    const { localDataUrl } = this.state;
    if (!localDataUrl) return;
    const base64 = String(localDataUrl).split(',')[1];
    if (!base64) return;
    this.setState({ isLoading: true, boxes: [], facesData: [], colorData: [] });
    try {
      const [{ regions }, { colors }] = await Promise.all([
        detectFacesBase64(base64),
        recognizeColorsBase64(base64)
      ]);
      // Aggiorna sempre i colori
      this.setState({ colorData: colors });
      const img = document.getElementById('inputimage');
      if (img && regions.length > 0) {
        const width = img.width;
        const height = img.height;
        const boxes = regions.map(r => {
          const b = r.region_info.bounding_box;
          return {
            leftCol: b.left_col * width,
            topRow: b.top_row * height,
            rightCol: b.right_col * width,
            bottomRow: b.bottom_row * height
          };
        });
        const facesData = regions.map(r => r.data?.concepts?.[0]).filter(Boolean);
        this.setState({ boxes, facesData });
        this.incrementEntries();
      } else {
        this.setState({ boxes: [], facesData: [] });
      }
    } catch (error) {
      console.error('Errore rilevamento facce (file locale):', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };




  render() {
    const { isLoading, localDataUrl } = this.state;

    return (
      <div className='App'>
        <div className='particles'>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
          <span className='particle'></span>
        </div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          onFileChange={this.onFileChange}
          onLocalDetect={this.onLocalDetect}
          hasLocalFile={!!localDataUrl}
          isLoading={isLoading}
        />
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} faceData={this.state.facesData} colorData={this.state.colorData} />
      </div>
    );
  }
}

export default App;