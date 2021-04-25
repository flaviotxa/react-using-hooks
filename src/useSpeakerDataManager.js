import speakersReducer from "./speakersReducer";
import axios from "axios";
import { useEffect, useReducer } from "react";

function useSpeakerDataManager() {
  const [{ isLoading, speakerList, favoriteClickCount }, dispatch] = useReducer(
    speakersReducer,
    {
      isLoading: true,
      speakerList: [],
      favoriteClickCount: 0,
    }
  );

  function incrementClickCount() {
    dispatch({ type: "incrementFavoriteClickCount" });
  }

  function toggleSpeakerFavorite(speakerRec) {
    const updateData = async function () {
      axios.put(`/api/speakers/${speakerRec.id}`, {
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
    const fetchData = async function () {
      let result = await axios.get("/api/speakers");
      dispatch({ type: "setSpeakerList", data: result.data });
    };
    fetchData();
    return () => {
      console.log("cleanup");
    };
  }, []);
  return {
    isLoading,
    speakerList,
    favoriteClickCount,
    incrementClickCount,
    toggleSpeakerFavorite,
  };
}
export default useSpeakerDataManager;
