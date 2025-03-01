import { useAuth } from '../context/AuthContext';
import { XMarkIcon, PencilIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.avatar || '');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameUpdate = async () => {
    if (newUsername.trim()) {
      //await updateProfile({ username: newUsername });
      setIsEditing(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      setShowPreview(true);
    }
  };

  const handleConfirmImage = async () => {
    setImageUrl(previewUrl);
    setShowPreview(false);
    // TODO: Implement image upload
    //const imageUrl = await uploadImage(file);
    //await updateProfile({ avatar: imageUrl });
  };

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setShowPreview(false);
  };

  return (
    <div className="flex h-full flex-col bg-secondary py-6 shadow-xl">
      <div className="px-4 sm:px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Profile Settings</h2>
          <div className="ml-3 flex h-7 items-center">
            <button
              type="button"
              className="relative rounded-md bg-secondary text-zinc-400 hover:text-zinc-500 focus:outline-none"
              onClick={() => window.history.back()}
            >
              <span className="absolute -inset-2.5" />
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex-1 px-4 sm:px-6">
        <div className="flex flex-col justify-center items-center">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <img
              className="w-32 h-32 rounded-full outline outline-4 outline-secondary"
              src={showPreview ? previewUrl : imageUrl}
              alt="avatar"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {showPreview && (
            <div className="mt-4 flex gap-2">
              <Button severity="primary" onClick={handleConfirmImage}>
                Confirm
              </Button>
              <Button severity="secondary" onClick={handleCancelPreview}>
                Cancel
              </Button>
            </div>
          )}

          <div className="w-full flex flex-col justify-center items-center text-center">
            {isEditing ? (
              <div className="w-full max-w-sm flex justify-center items-center mt-5 gap-2">
                <Input
                  placeholder="Enter new username..."
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Button severity="primary" onClick={handleUsernameUpdate}>
                  Save
                </Button>
                <Button
                  severity="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="w-full inline-flex justify-center items-center text-center mt-5">
                <h1 className="text-2xl font-semibold truncate-1">
                  {user?.username}
                </h1>
                <button onClick={() => setIsEditing(true)}>
                  <PencilIcon className="w-5 h-5 ml-4" />
                </button>
              </div>
            )}

            <p className="mt-2 text-zinc-400 text-sm">{user?.name}</p>
            <p className="mt-2 text-zinc-400 text-sm">{user?.email}</p>
          </div>

          <hr className="border-[0.1px] border-zinc-600 my-5 w-full max-w-sm" />

          <div className="w-full max-w-sm">
            <Button
              fullWidth
              severity="danger"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;