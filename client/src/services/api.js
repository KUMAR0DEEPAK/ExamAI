import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { setUserData } from "../redux/userSlice.js";

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser", 
        {withCredentials:true})
        
        dispatch(setUserData(result.data))
    } catch (error) {
        console.log(error)
    }
}


export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/notes/generate-notes",
      payload,
      { withCredentials: true }
    );

    console.log(result.data);
    return result.data;
  } catch (err) {
    console.log(err);
  }
};

export const downloadPdf = async (result) => {
  try {
    const response = await axios.post(
      serverUrl + "/api/notes/generate-pdf",
      { result },
      { responseType: "blob", withCredentials: true }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamAI.pdf";

    document.body.appendChild(link);   // fix
    link.click();
    document.body.removeChild(link);   // cleanup

    setTimeout(() => {
      window.URL.revokeObjectURL(url); // safe revoke
    }, 100);

  } catch (error) {
    throw new Error("PDF Download failed!");
  }
};


