import React from "react";
import SceneFrame from "./components/SceneFrame";
import { Ladybug, JsIcon, JavaIcon, PythonIcon, CIcon, Invader, Blob, Cloud } from "./components/icons/TechIcons";
import "./components/critters.css";
import "./StartScreen.css";

/**
 * StartScreen
 * -----------
 * Fullscreen arcade hero shown once loading finishes. Recreates the
 * reference banner: title + tagline + roaming bugs/language icons on
 * the left, an arcade cabinet on the right whose screen now prompts
 * the player to start instead of showing gameplay footage.
 *
 * Props:
 *  - onStart (function, optional): called when the player presses
 *    the "CLICK TO START" button — wire this to however your game
 *    actually boots up (route change, setState, etc).
 */
export default function StartScreen({ onStart }) {
  return (
    <SceneFrame>
      <div className="startscreen">
        <Cloud className="critter critter--cloud startscreen__cloud" />

        <JsIcon className="critter critter--a startscreen__deco startscreen__deco--js" />
        <JavaIcon className="critter critter--b startscreen__deco startscreen__deco--java" />
        <PythonIcon className="critter critter--c startscreen__deco startscreen__deco--python" />
        <CIcon className="critter critter--d startscreen__deco startscreen__deco--c" />
        <Invader className="critter critter--e startscreen__deco startscreen__deco--invader" />
        <Blob className="critter critter--f startscreen__deco startscreen__deco--blob" />
        <Ladybug className="critter critter--a startscreen__deco startscreen__deco--bug" />

        <div className="startscreen__left">
          <h1 className="startscreen__title">
            <span className="startscreen__title-line">CODE</span>
            <span className="startscreen__title-line startscreen__title-line--buggies">BUGGIES</span>
          </h1>
          <p className="startscreen__tagline">DEBUG &bull; COMPETE &bull; DOMINATE</p>
        </div>

        <div className="startscreen__right">
          <div className="arcade">
            <div className="arcade__marquee">
              <span className="arcade__star">&#9733;</span>
              <span className="arcade__marquee-text">PLAY NOW</span>
              <span className="arcade__star">&#9733;</span>
            </div>

            <div className="arcade__screen-bezel">
              <div className="arcade__screen">
                <p className="arcade__screen-text">CLICK TO START</p>
                <button
                  type="button"
                  className="arcade__play-button"
                  onClick={onStart}
                  aria-label="Click to start the game"
                >
                  <span className="arcade__play-triangle" />
                </button>
              </div>
            </div>

            <div className="arcade__panel">
              <p className="arcade__panel-text">CODING GAME</p>
              <div className="arcade__langs">
                <PythonIcon className="arcade__lang-icon" />
                <JsIcon className="arcade__lang-icon" />
                <JavaIcon className="arcade__lang-icon" />
                <CIcon className="arcade__lang-icon" />
              </div>
            </div>

            <div className="arcade__base">
              <span className="arcade__speaker" />
              <span className="arcade__speaker" />
            </div>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}