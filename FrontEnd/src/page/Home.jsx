import React, { useState, useEffect, useRef } from "react";
import Card from "../components/elements/Card";
import Text from "../components/elements/Text";
import Button from "../components/elements/Button";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, analytics } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore/lite";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const notify = () => toast("That is good , uploaded successfully");

  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [file, setfile] = useState();

  useEffect(() => {
    const intervalID = setInterval(() => {}, 1000);

    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  console.log("user here: ", user.uid);


  const submitdata = async () => {
    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("userId", user.uid);

    axios
      .post("http://localhost:7000/api/uploadImage/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        fetchData();
        const shortenedUrl = response.data.shortenedUrl;
        setimage(shortenedUrl);
        setLoading(false);

        notify();
      })
      .catch((error) => {
        console.error("Error uploading image", error);
        setLoading(false);
      });
    fetchData();
  };

  const db = getFirestore();
  const [image, setimage] = useState();
  const [alldoc, setalldoc] = useState();
  useEffect(() => {
    fetchData();
  }, [image]);

  const fetchData = async () => {
    const q = query(collection(db, "urls"), where("userId", "==", user.uid));
    console.log(q);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data().shortenedUrl);
      setimage(doc.data().shortenedUrl);
    });
 
  };

  console.log(image);

  return (
    <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">
      <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
        <ToastContainer />

        <Card className="py-4 col-span-2">
          <section className="flex justify-center items-center text-center">
            <div>
              <Text className="font-bold text-2xl">Stay focused</Text>

              {!image && (
                <>
                  <input
                    type="file"
                    onChange={(e) => setfile(e.target.files[0])}
                  ></input>
                  <Button onClick={submitdata}>
                    {" "}
                    {loading ? "loading ..." : " submit "}
                  </Button>
                </>
              )}
              {image && <img src={image} width={100} height={100} />}
            </div>
          </section>
        </Card>
      </section>
    </section>
  );
};

export default Home;
