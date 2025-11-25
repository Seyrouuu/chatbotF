// src/components/Chatbot/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Sun, 
  Moon, 
  Zap, 
  FileText, 
  Globe, 
  Send, 
  Trash2, 
  Copy, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [text, setText] = useState('');
  const [action, setAction] = useState('translate');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Effets de particules
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-15),
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            duration: Math.random() * 2 + 1
          }
        ]);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [loading]);

  // Thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme ? JSON.parse(savedTheme) : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      showError('Veuillez entrer du texte');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        text: text,
        action: action
      }, {
        timeout: 30000
      });

      setTimeout(() => {
        setResult(response.data.result);
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } catch (err) {
      console.error('API Error:', err);
      showError(err.response?.data?.error || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const clearForm = () => {
    setText('');
    setResult('');
    setError('');
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Échec de la copie');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  const features = [
    { icon: <Zap size={16} />, text: 'Traitement IA', color: 'var(--accent-1)' },
    { icon: <Shield size={16} />, text: 'Sécurisé', color: 'var(--accent-2)' },
    { icon: <BarChart3 size={16} />, text: 'Haute précision', color: 'var(--accent-3)' },
    { icon: <Clock size={16} />, text: 'Rapide', color: 'var(--accent-4)' }
  ];

  return (
    <div className="chatbot-container">
      {/* Background Animé */}
      <div className="animated-background">
        <div className="floating-shapes">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="floating-shape" style={{
              animationDelay: `${i * 2}s`,
              left: `${20 + i * 15}%`
            }} />
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleDarkMode}
        className="theme-toggle-btn"
        aria-label="Toggle theme"
      >
        <div className="theme-toggle-inner">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </div>
        <div className="theme-glow"></div>
      </button>

      <div className="chatbot-glass">
        {/* Header */}
        <div className="chatbot-header">
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-main">
                <Sparkles className="logo-icon" />
                <div className="logo-orbits">
                  <div className="orbit orbit-1"></div>
                  <div className="orbit orbit-2"></div>
                  <div className="orbit orbit-3"></div>
                </div>
              </div>
              <div className="logo-shine"></div>
            </div>
            <div className="header-content">
              <h1 className="chatbot-title">
                Neuro<span className="gradient-text">Lingua</span>
              </h1>
              <p className="chatbot-subtitle">
                Assistant IA de traduction et résumé intelligent
              </p>
            </div>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-chip">
                <div 
                  className="feature-icon"
                  style={{ '--feature-color': feature.color }}
                >
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="chatbot-content">
          <form onSubmit={handleSubmit} className="chatbot-form">
            <div className="form-section">
              <label className="form-label">
                <Zap className="label-icon" />
                Service sélectionné
              </label>
              <div className="action-tabs">
                <button
                  type="button"
                  className={`action-tab ${action === 'translate' ? 'active' : ''}`}
                  onClick={() => setAction('translate')}
                >
                  <Globe size={18} />
                  Traduction EN → AR
                </button>
                <button
                  type="button"
                  className={`action-tab ${action === 'summarize' ? 'active' : ''}`}
                  onClick={() => setAction('summarize')}
                >
                  <FileText size={18} />
                  Résumé de texte
                </button>
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">
                <FileText className="label-icon" />
                {action === 'translate' ? 'Texte source (Anglais)' : 'Contenu à résumer'}
                <span className="required-asterisk">*</span>
              </label>
              <div className="textarea-container">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="modern-textarea"
                  placeholder={
                    action === 'translate' 
                      ? 'Saisissez votre texte en anglais...\nExemple: "The quick brown fox jumps over the lazy dog."'
                      : 'Collez votre texte à résumer ici...\nLe résumé sera généré automatiquement.'
                  }
                  disabled={loading}
                  rows={4}
                />
                <div className="textarea-focus-border"></div>
                
                {/* Particles pendant le chargement */}
                {loading && particles.map(particle => (
                  <div
                    key={particle.id}
                    className="particle"
                    style={{
                      left: `${particle.x}%`,
                      animationDuration: `${particle.duration}s`
                    }}
                  />
                ))}
              </div>
              <div className="input-stats">
                <span>{text.length} caractères</span>
                <span>{text.trim() ? text.trim().split(/\s+/).length : 0} mots</span>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={clearForm}
                className="btn btn-secondary"
                disabled={loading}
              >
                <Trash2 size={18} />
                Effacer
              </button>
              <button 
                type="submit" 
                disabled={loading || !text.trim()}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {action === 'translate' ? 'Traduire' : 'Résumer'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="error-toast">
              <AlertCircle className="error-icon" />
              <div className="error-content">
                <strong>Erreur</strong>
                <p>{error}</p>
              </div>
              <button onClick={() => setError('')} className="error-close">
                ×
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div ref={resultRef} className="result-section">
              <div className="result-header">
                <div className="result-title">
                  <Sparkles className="result-icon" />
                  <h3>Résultat du traitement</h3>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  {copied ? 'Copié!' : 'Copier'}
                </button>
              </div>
              
              <div className="result-content">
                <div className="result-text">
                  {result}
                </div>
              </div>

              <div className="result-footer">
                <div className="result-meta">
                  <span className="result-stat">
                    {result.length} caractères
                  </span>
                  <span className="result-stat">
                    Généré à {new Date().toLocaleTimeString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="chatbot-footer">
          <div className="footer-content">
            <div className="tech-stack">
              <span>Powered by Transformers • Helsinki-NLP • React • Django</span>
            </div>
            <div className="footer-actions">
              <button className="footer-btn">Documentation</button>
              <button className="footer-btn">API</button>
              <button className="footer-btn">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;