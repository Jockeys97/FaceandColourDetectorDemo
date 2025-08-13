import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
// Rimosse integrazioni API/FaceRecognition

import './App.css';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import { detectFaces } from './services/apiService';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      isLoading: false,
      boxes: [],
      facesData: []
    };
  }

  componentDidMount() {
    // Nessun controllo API
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = async () => {
    const { input } = this.state;
    if (!input) return;
    this.setState({ isLoading: true, imageUrl: input, boxes: [], facesData: [] });
    try {
      const { regions } = await detectFaces(input);
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
      }
    } catch (error) {
      console.error('Errore rilevamento facce:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  
  render() {
    const { isLoading } = this.state;

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
        <Navigation />
        <Logo />
        <Rank />
        
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          isLoading={isLoading}
        />
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} faceData={this.state.facesData} />
      </div>
    );
  }
}

export default App;