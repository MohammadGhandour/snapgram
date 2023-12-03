import "./globals.css";
import { Routes, Route } from "react-router-dom";

import AuthLayout from "./_auth/AuthLayout";
import RouteLayout from "./_root/RouteLayout";

import { SigninForm, SignupForm } from "./_auth/forms";
import { Toaster } from "./components/ui/toaster";
import { AllUsers, CreatePost, EditPost, Explore, Home, LikedPosts, PostDetails, Profile, Saved, UpdateProfile } from "./_root/Pages";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/sign-in" element={<SigninForm />} />
        </Route>

        <Route element={<RouteLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/edit-profile/:id" element={<UpdateProfile />} />
          <Route path="/liked" element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
