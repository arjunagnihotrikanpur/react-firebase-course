import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import { auth, db, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes } from 'firebase/storage';

const App = () => {

  const [movieList, setMovieList] = useState([]);

  // New movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  // Update Movie Title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  // File Upload States
  const [fileUpload, setFileUpload] = useState(null)


  const moviesCollectionRef = collection(db, "movies")

  const getMovieList = async () => {
    // READ THE DATA
    // SET THE MOVIE LIST STATE TO THAT DATA
    try {
      const data = await getDocs(moviesCollectionRef)
      const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
      setMovieList(filteredData)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getMovieList();
  }, [])

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, 
        {title: newMovieTitle, releaseDate: newReleaseDate, receivedAnOscar: isNewMovieOscar, userId: auth?.currentUser?.uid});
      getMovieList();
    } catch (err) {
      console.error(err)
    }
  }

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id)
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (err) {
      console.error(err)
    }
  }

  const updateMovieTitle = async (id) => {
    try {
      // UPDATE TITLE
      const movieDoc = doc(db, "movies", id)
      await updateDoc(movieDoc, {title: updatedTitle})
      getMovieList();
    } catch (err) {
      console.error(err)
    }
  }

  const uploadFile = async () => {
    if (fileUpload == null) return;
    const filesFolderRef = ref(storage, `project_files/${fileUpload.name}`)
    try {
      await uploadBytes(filesFolderRef, fileUpload)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <Auth />

      <div>
        <input placeholder='Movie title...' onChange={(e) => {setNewMovieTitle(e.target.value)}} />
        <input placeholder='Release Date...' type="number" onChange={(e) => {setNewReleaseDate(Number(e.target.value))}} />
        <input type='checkbox' checked={isNewMovieOscar} onChange={(e) => setIsNewMovieOscar(e.target.checked)} />
        <label>Received an Oscar?</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>

            <button onClick={() => {deleteMovie(movie.id)}}>Delete</button>
            <input type="text" placeholder='new title...' onChange={(e) => setUpdatedTitle(e.target.value)} />
            <button onClick={() => {updateMovieTitle(movie.id)}}>update</button>

          </div>
        ))}
      </div>

      <div>
        <input type='file' onChange={(e) => {setFileUpload(e.target.files[0])}} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  )
}

export default App;
