import { useEffect, useReducer, useContext } from "react";
import speakersReducer from "./speakersReducer";
import axios from "axios";

import { InitialSpeakersDataContext } from "../pages/speakers";

function useSpeakerDataManager() {
  const initialSpeakersData = useContext(InitialSpeakersDataContext);

  const [{ isLoading, speakerList }, dispatch] = useReducer(speakersReducer, {
    isLoading: false,
    speakerList: initialSpeakersData,
  });

  function toggleSpeakerFavorite(speakerRec) {
    const updateData = async function () {
      await axios.put(`/api/speakers/${speakerRec.id}`, {
        ...speakerRec,
        favorite: !speakerRec.favorite,
      });
      speakerRec.favorite === true
        ? dispatch({ type: "unfavorite", id: speakerRec.id })
        : dispatch({ type: "favorite", id: speakerRec.id });
    };
    updateData();
  }

  useEffect(() => {
    // new Promise(function (resolve) {
    //   setTimeout(function () {
    //     resolve();
    //   }, 1000);
    // }).then(() => {
    //   dispatch({
    //     type: "setSpeakerList",
    //     data: SpeakerData,
    //   });
    // });
    const fetchData = async function () {
      let result = await axios.get("/api/speakers");
      dispatch({ type: "setSpeakerList", data: result.data });
    };

    fetchData();

    return () => {
      console.log("cleanup");
    };
  }, []); // [speakingSunday, speakingSaturday]);
  return { isLoading, speakerList, toggleSpeakerFavorite };
}

export default useSpeakerDataManager;
