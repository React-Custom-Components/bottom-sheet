import React from 'react';
import './App.scss';
import BottomSheet from "./bottomSheet/bottomSheet";

const App = () => {

  return (
    <div className="mainContainer">
        <span className={'title'}>
            Made with love by Med Chouiref A.K.A. JS-GOD.
        </span>

        <BottomSheet>
            <span>You can pass anything !</span>
        </BottomSheet>
    </div>
  );
}

export default App;
