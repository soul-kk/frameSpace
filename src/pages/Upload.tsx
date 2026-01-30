import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import anime from 'animejs';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';
import { cn } from '../lib/utils';

export const UploadPage = () => {
  const navigate = useNavigate();
  // const { addMovie } = useMovies();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });
    }
  }, []);

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('movieDraft');
    if (draft) {
      const data = JSON.parse(draft);
      if (data.poster) setUploadedImage(data.poster);

      // Populate form fields
      if (formRef.current) {
        Object.keys(data).forEach(key => {
          const input = formRef.current?.elements.namedItem(key) as HTMLInputElement;
          if (input) input.value = data[key];
        });
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-black', 'bg-gray-50');
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-black', 'bg-gray-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-black', 'bg-gray-50');
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, poster: 'Please select an image file' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, poster: 'File size must be less than 10MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.poster;
        return newErrors;
      });
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const title = formData.get('title') as string;
    const year = formData.get('year') as string;
    const director = formData.get('director') as string;
    const genre = formData.get('genre') as string;
    const rating = formData.get('rating') as string;
    const description = formData.get('description') as string;

    if (!title) newErrors.title = 'Title is required';
    if (!year) newErrors.year = 'Year is required';
    else if (Number(year) < 1900 || Number(year) > 2030) newErrors.year = 'Year must be between 1900 and 2030';

    if (!director) newErrors.director = 'Director is required';
    if (!genre) newErrors.genre = 'Genre is required';

    if (!rating) newErrors.rating = 'Rating is required';
    else if (Number(rating) < 0 || Number(rating) > 10) newErrors.rating = 'Rating must be between 0 and 10';

    if (!description) newErrors.description = 'Description is required';
    else if (description.length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!uploadedImage) newErrors.poster = 'Poster is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormData = () => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);
    return {
      title: formData.get('title') as string,
      year: Number(formData.get('year')),
      director: formData.get('director') as string,
      genre: formData.get('genre') as string,
      rating: Number(formData.get('rating')),
      duration: Number(formData.get('duration')) || 0,
      description: formData.get('description') as string,
      actors: (formData.get('actors') as string).split(',').map(a => a.trim()).filter(Boolean),
      poster: uploadedImage || '',
    };
  };

  const handleSaveDraft = () => {
    const data = getFormData();
    if (data) {
      // We store raw strings for inputs in draft to restore easily
      const rawData = Object.fromEntries(new FormData(formRef.current!).entries());
      if (uploadedImage) rawData.poster = uploadedImage;

      localStorage.setItem('movieDraft', JSON.stringify(rawData));

      // Show feedback
      const btn = document.getElementById('draft-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Draft Saved!';
        btn.classList.add('bg-green-100', 'text-green-700');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('bg-green-100', 'text-green-700');
        }, 2000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (validateForm(formData)) {
      const movieData = getFormData();
      if (movieData) {
        // addMovie(movieData);
        alert("Upload feature is temporarily disabled.");
        // localStorage.removeItem('movieDraft');
        // setShowSuccess(true);
        
        // setTimeout(() => {
        //   navigate('/list');
        // }, 2000);
      }
    }
  };

  const togglePreview = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (validateForm(formData)) {
      setShowPreview(!showPreview);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-12">
        <h1 className="text-5xl font-bold text-black mb-4 font-serif">添加新电影</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          与您分享您最喜爱的电影，填写下面的表单以添加新的电影杰作。
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6">
        <div ref={containerRef} className="bg-white rounded-2xl shadow-xl p-8 opacity-0">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Movie Poster</label>
              <div
                className={cn(
                  "border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-black hover:bg-gray-50",
                  errors.poster && "border-red-500 bg-red-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadedImage && document.getElementById('poster-input')?.click()}
              >
                {uploadedImage ? (
                  <div className="relative group">
                    <img src={uploadedImage} alt="Preview" className="mx-auto max-h-96 rounded-lg shadow-md" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload movie poster</p>
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  id="poster-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              {errors.poster && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.poster}</p>}
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Movie Title *</label>
                <input
                  type="text"
                  name="title"
                  className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all", errors.title && "border-red-500")}
                  placeholder="Enter movie title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">Release Year *</label>
                <input
                  type="number"
                  name="year"
                  className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all", errors.year && "border-red-500")}
                  placeholder="2024"
                  min="1900"
                  max="2030"
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              {/* Director */}
              <div>
                <label htmlFor="director" className="block text-sm font-semibold text-gray-700 mb-2">Director *</label>
                <input
                  type="text"
                  name="director"
                  className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all", errors.director && "border-red-500")}
                  placeholder="Director name"
                />
                {errors.director && <p className="text-red-500 text-sm mt-1">{errors.director}</p>}
              </div>

              {/* Genre */}
              <div>
                <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-2">Genre *</label>
                <select
                  name="genre"
                  className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all bg-white", errors.genre && "border-red-500")}
                >
                  <option value="">Select genre</option>
                  <option value="剧情">剧情</option>
                  <option value="动作">动作</option>
                  <option value="科幻">科幻</option>
                  <option value="动画">动画</option>
                  <option value="惊悚">惊悚</option>
                  <option value="喜剧">喜剧</option>
                  <option value="恐怖">恐怖</option>
                  <option value="爱情">爱情</option>
                </select>
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all", errors.rating && "border-red-500")}
                  placeholder="8.5"
                  min="0"
                  max="10"
                />
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all"
                  placeholder="120"
                  min="1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                rows={4}
                className={cn("w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all", errors.description && "border-red-500")}
                placeholder="Brief description of the movie..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Actors */}
            <div>
              <label htmlFor="actors" className="block text-sm font-semibold text-gray-700 mb-2">Main Actors</label>
              <input
                type="text"
                name="actors"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black focus:ring-0 outline-none transition-all"
                placeholder="Actor 1, Actor 2, Actor 3"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple actors with commas</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-100 gap-4">
              <button
                type="button"
                id="draft-btn"
                onClick={handleSaveDraft}
                className="px-6 py-3 rounded-full font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                保存草稿
              </button>
              <button
                type="button"
                onClick={togglePreview}
                className="px-6 py-3 rounded-full font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                预览
              </button>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                添加电影
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black font-serif">Movie Preview</h3>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-48 flex-shrink-0">
                  <img src={uploadedImage || ''} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-black mb-2">{getFormData()?.title}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                    <p><span className="font-semibold text-gray-700">Year:</span> {getFormData()?.year}</p>
                    <p><span className="font-semibold text-gray-700">Genre:</span> <span className="capitalize">{getFormData()?.genre}</span></p>
                    <p><span className="font-semibold text-gray-700">Director:</span> {getFormData()?.director}</p>
                    <p><span className="font-semibold text-gray-700">Rating:</span> {getFormData()?.rating}/10</p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-4">{getFormData()?.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    setShowPreview(false);
                    handleSubmit(e as any);
                  }}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Confirm Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <div className={cn(
        "fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl z-50 transition-all duration-500 transform flex items-center gap-3",
        showSuccess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <CheckCircle2 className="w-6 h-6" />
        <div>
          <p className="font-bold">Movie Added Successfully!</p>
          <p className="text-sm text-white/90">Your movie has been added to the collection.</p>
        </div>
      </div>
    </div>
  );
};

