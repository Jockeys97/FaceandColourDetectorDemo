import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, isLoading = false, disabledButton = false }) => {
    return (
        <div>
            <p className="f3 white">
                {'Questo Magic Brain rileverà le facce nelle tue immagini. Provaci!'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                <input 
                    className="f4 pa2 w-70 center" 
                    type="text" 
                    onChange={onInputChange}
                    placeholder="Inserisci URL immagine..."
                    disabled={isLoading}
                />
                <button 
                    className={`w-30 grow f4 link ph3 pv2 dib white ${(isLoading || disabledButton) ? 'bg-gray' : 'bg-light-purple'}`}
                    onClick={onButtonSubmit}
                    disabled={isLoading || disabledButton}
                >
                    {isLoading ? 'Analizzando...' : 'Rileva'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default ImageLinkForm;