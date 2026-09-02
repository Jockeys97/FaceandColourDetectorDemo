import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ input, onInputChange, onButtonSubmit, onFileChange, onLocalDetect, onSampleClick, hasLocalFile, isLoading }) => (
  <section className="input-panel" aria-labelledby="analyse-title">
    <div className="panel-heading"><div><p className="section-kicker">ANALYSE WORKSPACE</p><h2 id="analyse-title">Scegli un’immagine</h2></div><button className="sample-button" type="button" onClick={onSampleClick} disabled={isLoading}>Prova un esempio</button></div>
    <div className="input-grid">
      <div className="source-card"><div className="source-icon">↗</div><div><h3>Da URL</h3><p>Inserisci il link diretto a un’immagine pubblica.</p></div><label className="sr-only" htmlFor="image-url">URL dell’immagine</label><div className="url-control"><input id="image-url" value={input} onChange={onInputChange} placeholder="https://esempio.it/immagine.jpg" disabled={isLoading} onKeyDown={(event) => event.key === 'Enter' && onButtonSubmit()} /><button className="primary-button" type="button" onClick={onButtonSubmit} disabled={isLoading}>{isLoading ? 'Analisi…' : 'Analizza'}</button></div></div>
      <div className="source-card"><div className="source-icon">↑</div><div><h3>Da file locale</h3><p>Il file viene elaborato soltanto per questa analisi.</p></div><label className="file-picker" htmlFor="image-file"><span>{hasLocalFile ? 'File selezionato' : 'Scegli un’immagine'}</span><small>JPG, PNG, WebP</small></label><input className="hidden-file-input" id="image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} disabled={isLoading} /><button className="secondary-button" type="button" onClick={onLocalDetect} disabled={!hasLocalFile || isLoading}>{isLoading ? 'Analisi…' : 'Analizza il file'}</button></div>
    </div>
  </section>
);
export default ImageLinkForm;
