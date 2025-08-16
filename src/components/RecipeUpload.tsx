import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Video, 
  Image, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Scissors, 
  Edit3, 
  Globe, 
  Eye, 
  X, 
  Plus,
  Lightbulb,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RecipeUploadProps {
  onClose: () => void;
}

interface UploadedMedia {
  type: 'video' | 'image';
  file: File;
  url: string;
  duration?: number;
}

interface VoiceSegment {
  type: 'ingredients' | 'method';
  text: string;
  confidence: number;
  timestamp: number;
}

const RecipeUpload: React.FC<RecipeUploadProps> = ({ onClose }) => {
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [method, setMethod] = useState<string[]>([]);
  
  // Voice recording
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceSegments, setVoiceSegments] = useState<VoiceSegment[]>([]);
  
  const mediaRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const supportedLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Hindi', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  const suggestedTags = [
    'Quick', 'Healthy', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer',
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American'
  ];

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      alert('Please upload a video or image file');
      return;
    }

    const url = URL.createObjectURL(file);
    const media: UploadedMedia = {
      type: isVideo ? 'video' : 'image',
      file,
      url
    };

    setUploadedMedia(media);
  };

  const handleVoiceRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
          setIsProcessing(true);
          
          // Simulate AI processing
          setTimeout(() => {
            processVoiceRecording(blob);
            setIsProcessing(false);
          }, 2000);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        
        recordingInterval.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        // Stop recording after 60 seconds
        setTimeout(() => {
          if (isRecording) {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }
        }, 60000);

      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to record voice');
      }
    } else {
      // Stop recording
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
  }, [isRecording]);

  const processVoiceRecording = (blob: Blob) => {
    // Simulate AI processing - in real app, this would call an AI service
    const mockSegments: VoiceSegment[] = [
      {
        type: 'ingredients',
        text: '2 cups all-purpose flour, 1 cup sugar, 3 eggs, 1 cup milk',
        confidence: 0.95,
        timestamp: Date.now()
      },
      {
        type: 'method',
        text: 'Mix flour and sugar, beat eggs, combine wet and dry ingredients, bake at 350°F for 25 minutes',
        confidence: 0.92,
        timestamp: Date.now()
      }
    ];

    setVoiceSegments(mockSegments);
    
    // Auto-populate ingredients and method
    const ingredientsText = mockSegments.find(s => s.type === 'ingredients')?.text || '';
    const methodText = mockSegments.find(s => s.type === 'method')?.text || '';
    
    setIngredients(ingredientsText.split(',').map(item => item.trim()));
    setMethod(methodText.split(',').map(step => step.trim()));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addMethodStep = () => {
    setMethod([...method, '']);
  };

  const updateMethodStep = (index: number, value: string) => {
    const newMethod = [...method];
    newMethod[index] = value;
    setMethod(newMethod);
  };

  const removeMethodStep = (index: number) => {
    setMethod(method.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert('Please enter a recipe title');
      return;
    }
    
    if (!uploadedMedia) {
      alert('Please upload a photo or video');
      return;
    }

    if (ingredients.length === 0 || method.length === 0) {
      alert('Please add ingredients and method steps');
      return;
    }

    // Here you would upload to your backend
    console.log('Publishing recipe:', {
      title,
      description,
      tags,
      ingredients,
      method,
      language: selectedLanguage,
      media: uploadedMedia
    });

    alert('Recipe published successfully!');
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 font-montserrat">
              Create New Recipe
            </h1>
          </div>
          <button
            onClick={handlePublish}
            className="bg-cookbook-orange text-white px-6 py-2 rounded-full font-medium hover:bg-cookbook-orange/90 transition-colors font-montserrat"
          >
            Publish Recipe
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Media Upload Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">
              Upload Photo or Video
            </h2>
            
            {!uploadedMedia ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cookbook-orange transition-colors">
                <input
                  ref={mediaRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => mediaRef.current?.click()}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Image className="w-12 h-12 text-cookbook-orange" />
                      <span className="text-sm font-medium text-gray-700">Photo</span>
                    </button>
                    <button
                      onClick={() => mediaRef.current?.click()}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Video className="w-12 h-12 text-cookbook-orange" />
                      <span className="text-sm font-medium text-gray-700">Video</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to upload (Max 100MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {uploadedMedia.type === 'video' ? (
                    <video
                      src={uploadedMedia.url}
                      className="w-full h-64 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={uploadedMedia.url}
                      alt="Recipe preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Scissors className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {uploadedMedia.type === 'video' ? 'Video' : 'Photo'} uploaded
                  </span>
                  <button
                    onClick={() => setUploadedMedia(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Input Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 font-montserrat">
                Voice Input
              </h2>
              <div className="flex items-center space-x-2 text-sm text-cookbook-orange bg-orange-50 px-3 py-1 rounded-full">
                <Lightbulb className="w-4 h-4" />
                <span>Tip: Try voice for fast recipe input!</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleVoiceRecording}
                  disabled={isProcessing}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-cookbook-orange text-white hover:bg-cookbook-orange/90'
                  } disabled:opacity-50 font-montserrat`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>

                {isRecording && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    <span className="font-mono font-medium">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center space-x-2 text-cookbook-orange">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-cookbook-orange border-t-transparent" />
                    <span>Processing voice...</span>
                  </div>
                )}
              </div>

              {voiceSegments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">AI Processed Results:</h3>
                  {voiceSegments.map((segment, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          segment.type === 'ingredients' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {segment.type === 'ingredients' ? 'Ingredients' : 'Method'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(segment.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{segment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recipe Details Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">
              Recipe Details
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your recipe title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors font-montserrat"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 bg-cookbook-orange/10 text-cookbook-orange px-3 py-1 rounded-full text-sm font-medium"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-cookbook-orange/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add custom tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors text-sm"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-cookbook-orange text-white rounded-lg hover:bg-cookbook-orange/90 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
                          disabled={tags.includes(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            tags.includes(tag)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your recipe, cooking tips, or story behind it..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors font-montserrat resize-none"
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors font-montserrat"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="flex items-center space-x-2 px-4 py-3 bg-cookbook-yellow text-cookbook-black rounded-lg hover:bg-cookbook-yellow/90 transition-colors font-medium font-montserrat"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Translate & Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 font-montserrat">
                Ingredients
              </h2>
              <button
                onClick={addIngredient}
                className="flex items-center space-x-2 px-4 py-2 bg-cookbook-green text-white rounded-lg hover:bg-cookbook-green/90 transition-colors font-medium font-montserrat"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-cookbook-orange text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="Enter ingredient..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors font-montserrat"
                  />
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {ingredients.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No ingredients added yet. Use voice input or add manually.
                </p>
              )}
            </div>
          </div>

          {/* Method Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 font-montserrat">
                Method Steps
              </h2>
              <button
                onClick={addMethodStep}
                className="flex items-center space-x-2 px-4 py-2 bg-cookbook-green text-white rounded-lg hover:bg-cookbook-green/90 transition-colors font-medium font-montserrat"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {method.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="w-8 h-8 bg-cookbook-orange text-white rounded-full flex items-center justify-center text-sm font-bold font-montserrat flex-shrink-0">
                    {index + 1}
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => updateMethodStep(index, e.target.value)}
                    placeholder="Describe this step..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cookbook-orange focus:border-transparent transition-colors font-montserrat resize-none"
                  />
                  <button
                    onClick={() => removeMethodStep(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {method.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No method steps added yet. Use voice input or add manually.
                </p>
              )}
            </div>
          </div>

          {/* Translation Preview */}
          {showTranslation && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-montserrat">
                  Translation Preview
                </h2>
                <div className="flex items-center space-x-2 text-sm text-cookbook-orange bg-orange-50 px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4" />
                  <span>Preview Mode</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Title (Translated)</h3>
                  <p className="text-gray-700">{title || 'Recipe title will appear here...'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Description (Translated)</h3>
                  <p className="text-gray-700">{description || 'Recipe description will appear here...'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Ingredients (Translated)</h3>
                  <ul className="space-y-1">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">• {ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Method (Translated)</h3>
                  <ol className="space-y-2">
                    {method.map((step, index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium">{index + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Publish Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handlePublish}
                disabled={!title.trim() || !uploadedMedia || ingredients.length === 0 || method.length === 0}
                className="w-full bg-cookbook-orange text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-cookbook-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat"
              >
                🚀 Publish Recipe
              </button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Your recipe will be shared with the CookBook community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeUpload;
