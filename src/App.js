import React, { Component } from 'react';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import { analyseImage } from './services/browserVision';
import './App.css';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85';

class App extends Component {
  state = { input: '', imageUrl: '', isLoading: false, boxes: [], regions: [], facesData: [], colorData: [], localDataUrl: '', error: '', analysisCount: 0 };

  onInputChange = (event) => this.setState({ input: event.target.value });

  getBoxes = (regions) => {
    const image = document.getElementById('inputimage');
    if (!image || !regions?.length) return [];
    return regions.map(({ region_info: regionInfo }) => {
      const box = regionInfo.bounding_box;
      return { leftCol: box.left_col * image.clientWidth, topRow: box.top_row * image.clientHeight, rightCol: box.right_col * image.clientWidth, bottomRow: box.bottom_row * image.clientHeight };
    });
  };

  runAnalysis = async (source) => {
    this.setState({ isLoading: true, imageUrl: source, boxes: [], regions: [], facesData: [], colorData: [], error: '' });
    try {
      const { regions = [], colors = [] } = await analyseImage(source);
      const facesData = regions.map((region) => region.data?.concepts?.[0]).filter(Boolean);
      this.setState((previous) => ({ facesData, colorData: colors, regions, boxes: this.getBoxes(regions), analysisCount: previous.analysisCount + 1 }));
    } catch (error) {
      console.error('Analysis failed:', error);
      this.setState({ error: 'Non sono riuscito ad analizzare questa immagine. Prova con un URL pubblico diretto oppure con un file JPG, PNG o WebP.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onButtonSubmit = () => {
    const input = this.state.input.trim();
    if (!input) return this.setState({ error: 'Inserisci un URL di immagine prima di avviare l’analisi.' });
    this.runAnalysis(input);
  };

  onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.setState({ localDataUrl: reader.result, imageUrl: reader.result, boxes: [], regions: [], facesData: [], colorData: [], error: '' });
    reader.readAsDataURL(file);
  };

  onLocalDetect = () => {
    const { localDataUrl } = this.state;
    if (!localDataUrl) return;
    this.runAnalysis(localDataUrl);
  };

  onSampleClick = () => this.setState({ input: SAMPLE_IMAGE }, this.onButtonSubmit);

  onImageLoad = () => this.setState((state) => ({ boxes: this.getBoxes(state.regions) }));

  render() {
    const { isLoading, localDataUrl, input, imageUrl, boxes, facesData, colorData, error, analysisCount } = this.state;
    return (
      <main className="app-shell">
        <nav className="topbar" aria-label="Intestazione applicazione">
          <a className="brand" href="/" aria-label="Vision Lab home"><span className="brand-mark" aria-hidden="true">◉</span><span>Vision Lab</span></a>
          <span className="topbar-status"><i /> Demo interattiva</span>
        </nav>
        <section className="hero">
          <div className="eyebrow">COMPUTER VISION · FACE + COLOUR</div>
          <h1>Trasforma un’immagine in segnali visivi chiari.</h1>
          <p>Rileva i volti e i colori dominanti da un URL pubblico o da un file locale. I risultati sono mostrati direttamente sopra l’immagine.</p>
          <div className="hero-meta"><span>Face detection</span><span>Colour analysis</span><span>On-device processing</span></div>
        </section>
        <ImageLinkForm input={input} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} onFileChange={this.onFileChange} onLocalDetect={this.onLocalDetect} onSampleClick={this.onSampleClick} hasLocalFile={!!localDataUrl} isLoading={isLoading} />
        {error && <div className="error-banner" role="alert"><strong>Attenzione.</strong> {error}</div>}
        <FaceRecognition boxes={boxes} imageUrl={imageUrl} faceData={facesData} colorData={colorData} isLoading={isLoading} analysisCount={analysisCount} onImageLoad={this.onImageLoad} />
        <footer><span>Prototype by Alessio Fantini</span><span>Built with React · Google MediaPipe</span></footer>
      </main>
    );
  }
}

export default App;
