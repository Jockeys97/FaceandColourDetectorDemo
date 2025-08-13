import React from "react";
import { Tilt } from "react-tilt";
import brain from "./brain.png";


const Logo = () => {
    return (
        <div className="ma4 mt0 flex justify-center">
            <Tilt className="Tilt br2 shadow-2" options={{
                reverse: false,
                max: 35,
                perspective: 1000,
                scale: 1.1,
                speed: 1000,
                transition: true,
                axis: null,
                reset: true,
                easing: "cubic-bezier(.03,.98,.52,.99)"
            }} style={{ height: 50, width: 50, background: 'linear-gradient(89deg, rgba(128, 64, 174, 0.8) 0%, rgba(217, 213, 219, 0.8) 100%)' }}>
                <div className="Tilt-inner flex justify-center items-center">
                    <img alt="logo" src={brain} style={{ width: '40px', height: '40px' }} />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;
