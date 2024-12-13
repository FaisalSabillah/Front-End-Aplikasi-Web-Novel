import React from "react";
import { Routes, Route} from 'react-router-dom';
import Dashboard from './Routes/dashboard';
import Genre from './Routes/Genre';
import NovelList from './Routes/NovelList';
import Login from "./Components/Login";
import DashboardAdmin from "./Routes/dashboardAdmin";
import GenreAdmin from './Routes/GenreAdmin';
import FormGenre from "./Routes/FormGenre";
import FormNovel from "./Routes/FormNovel";
import FormChapter from "./Routes/FormChapter";
import NovelDetail from "./Routes/NovelDetail";
import ReadChapter from "./Routes/ReadChapter";
import EditNovel from "./Routes/EditNovel";
import EditGenre from "./Routes/EditGenre";
import NovelDetailAdmin from "./Routes/NovelDetailAdmin";
import EditChapter from "./Routes/EditChapter";
import NovelListwithGenre from "./Routes/NovelListwithGenre";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/novel/:id_novel" element={<NovelDetailAdmin />} />
            <Route path="/novel/:id_novel" element={<NovelDetail />} />
            <Route path="/admin/novel/:id_novel/editnovel" element={<EditNovel />} />-
            <Route path="admin/genreadmin" element={<GenreAdmin />} />
            <Route path="admin/genreadmin/formgenre" element={<FormGenre />} />
            <Route path="/admin/genreadmin/editgenre/:id_genre" element={<EditGenre />} />
            <Route path="/admin/formnovel" element={<FormNovel />} />
            <Route path="/admin/formchapter" element={<FormChapter />} />
            <Route path="/admin/formchapter/:id_novel/editchapter/:no_chapter" element={<EditChapter />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/novel" element={<NovelList />} />
            <Route path="/genre/novel/:id_genre" element={<NovelListwithGenre />} />
            <Route path="/novel/:id_novel/chapter/:no_chapter" element={<ReadChapter />} />
        </Routes>
      );
};

export default App;