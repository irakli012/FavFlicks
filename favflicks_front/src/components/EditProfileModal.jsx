import React, { useState, useEffect } from 'react';
import { AVATARS, getAvatarUrl } from '../utils/avatars';

const EditProfileModal = ({ isOpen, onClose, currentProfile, onSaveSuccess }) => {
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setBio(currentProfile.bio || '');
      setLocation(currentProfile.location || '');
      setSelectedAvatarId(currentProfile.profilePictureUrl || AVATARS[0].id);
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSuccess({
        bio,
        location,
        profilePictureUrl: selectedAvatarId
      });
      onClose();
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#1f1919] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Edit Profile
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection Grid */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Choose Avatar (Fun SVG Characters & Georgian Legends 🇬🇪)
            </label>
            <div className="grid grid-cols-4 gap-3 p-3 bg-black/30 rounded-xl border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id || selectedAvatarId === avatar.svgDataUrl;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={`relative rounded-full aspect-square overflow-hidden border-2 transition-all p-1 bg-surface-dark group ${
                      isSelected
                        ? 'border-red-500 scale-105 shadow-lg shadow-red-500/30'
                        : 'border-transparent hover:border-white/30 hover:scale-100'
                    }`}
                    title={avatar.name}
                  >
                    <img 
                      src={avatar.svgDataUrl} 
                      alt={avatar.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-500 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-1">Select one of our preset avatars. Direct file upload is disabled.</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">
              Location
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tbilisi, Georgia" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1">
              Bio
            </label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other movie lovers about yourself..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-600/20"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
