import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { QuizQuestion } from '../../types';
import {
  X,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';

export const SkillQuizModal: React.FC = () => {
  const { showQuizModal, setShowQuizModal, activeQuizModule, completeQuizAndGenerateCert } = useWorker();
  const { language } = useLanguage();

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showFullReview, setShowFullReview] = useState<boolean>(false);

  if (!showQuizModal || !activeQuizModule) return null;

  const questions: QuizQuestion[] = activeQuizModule.questions || [];
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    return score;
  };

  const finalScore = calculateScore();
  const isPassed = finalScore >= 7;

  // Identify missed questions for "Skill Areas Needing Improvement"
  const missedQuestions = questions.filter((q, idx) => selectedAnswers[idx] !== q.correctAnswerIndex);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClaimCertificate = () => {
    setShowQuizModal(false);
    completeQuizAndGenerateCert(activeQuizModule.id, finalScore);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setIsSubmitted(false);
    setShowFullReview(false);
  };

  return (
    <div
      className="animate-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={() => setShowQuizModal(false)}
    >
      <div
        className="animate-modal-enter"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-default)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border, #D9E9C8)',
                  textTransform: 'uppercase',
                }}
              >
                10-Mark Skill Test
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {activeQuizModule.profession} Trade
              </span>
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', margin: 0 }}>
              {language === 'hi' ? activeQuizModule.titleHi : activeQuizModule.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowQuizModal(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px', overflowY: 'auto', flex: 1 }}>
          {!isSubmitted ? (
            <div>
              {/* Progress Bar & Question Counter */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span>Pass Threshold: 7/10 (70%)</span>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      transition: 'width var(--transition-fast)',
                    }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '3px', textTransform: 'uppercase' }}>
                  Question #{currentQIndex + 1}
                </div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35, margin: '0 0 6px' }}>
                  {language === 'hi' ? currentQ.questionHi : currentQ.question}
                </h4>
                {language !== 'hi' && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {currentQ.questionHi}
                  </p>
                )}
              </div>

              {/* Options A, B, C, D */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  const optionLabel = language === 'hi' ? currentQ.optionsHi[optIdx] : option;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all var(--transition-fast)',
                      }}
                      className="hover-card"
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-strong)'}`,
                          backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: isSelected ? 700 : 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {optionLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SUBMISSION RESULT SCREEN */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Score Card Header */}
              <div style={{ textAlign: 'center', padding: '6px 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: isPassed ? '#ECFDF5' : '#FEF2F2',
                    border: `2px solid ${isPassed ? '#10B981' : '#EF4444'}`,
                    color: isPassed ? '#059669' : '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                  }}
                >
                  {isPassed ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                </div>

                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    color: isPassed ? 'var(--success-dark)' : 'var(--danger)',
                    backgroundColor: isPassed ? 'var(--success-light)' : 'var(--danger-light)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                  }}
                >
                  {isPassed ? 'Assessment Passed • Certified' : 'Assessment Incomplete (Retake Required)'}
                </span>

                <h3 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                  Score: {finalScore} / {questions.length} ({Math.round((finalScore / questions.length) * 100)}%)
                </h3>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 auto', maxWidth: '400px' }}>
                  {isPassed
                    ? (language === 'hi'
                        ? 'बधाई हो! आपने 70%+ अंक प्राप्त कर कौशल मानक उत्तीर्ण कर लिया है। आपका सत्यापित प्रमाण पत्र तैयार है।'
                        : 'Congratulations! You met the 70% proficiency standard. Your AIDORA trade competency certificate is ready.')
                    : (language === 'hi'
                        ? 'उत्तीर्ण होने के लिए कम से कम 7/10 अंक आवश्यक हैं। कृपया नीचे दिए गए कमजोर क्षेत्रों की समीक्षा करें और दोबारा टेस्ट दें।'
                        : 'Passing requires 7/10 or higher. Review the skill areas needing improvement below and retry the assessment.')}
                </p>
              </div>

              {/* Skill Areas Needing Improvement (if any missed) */}
              {missedQuestions.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={14} color="#D97706" />
                    <span>Skill Areas Needing Improvement ({missedQuestions.length} Topics):</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.6875rem', color: '#78350F', lineHeight: 1.4 }}>
                    {missedQuestions.map((q) => (
                      <li key={q.id} style={{ marginBottom: '3px' }}>
                        <strong>{q.question}</strong>
                        <div style={{ color: '#92400E', fontStyle: 'italic' }}>
                          Key Rule: {q.explanation}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Expandable Review & Correct Answers */}
              <div
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setShowFullReview(!showFullReview)}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={14} color="var(--primary)" />
                    <span>View All 10 Questions & Correct Answers</span>
                  </div>
                  {showFullReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showFullReview && (
                  <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                    {questions.map((q, idx) => {
                      const userAnsIdx = selectedAnswers[idx];
                      const isCorrect = userAnsIdx === q.correctAnswerIndex;

                      return (
                        <div
                          key={q.id}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 'var(--radius-xs)',
                            padding: '8px 10px',
                            border: `1px solid ${isCorrect ? '#A7F3D0' : '#FECACA'}`,
                            fontSize: '0.6875rem',
                          }}
                        >
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {idx + 1}. {q.question}
                          </div>
                          <div style={{ color: isCorrect ? 'var(--success-dark)' : 'var(--danger)', fontWeight: 700 }}>
                            Your Answer: {userAnsIdx !== undefined ? `${String.fromCharCode(65 + userAnsIdx)}. ${q.options[userAnsIdx]}` : 'Not Answered'} {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </div>
                          {!isCorrect && (
                            <div style={{ color: 'var(--success-dark)', fontWeight: 700, marginTop: '1px' }}>
                              Correct Answer: {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}
                            </div>
                          )}
                          <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                            💡 {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleRetry}
                  style={{
                    flex: isPassed ? 0.8 : 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={15} />
                  <span>{language === 'hi' ? 'टेस्ट दोबारा दें' : 'Retry Assessment'}</span>
                </button>

                {isPassed && (
                  <button
                    type="button"
                    onClick={handleClaimCertificate}
                    style={{
                      flex: 1.2,
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.8125rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    className="sahyog-btn"
                  >
                    <Award size={16} />
                    <span>{language === 'hi' ? 'प्रमाण पत्र देखें व सहेजें' : 'Generate & Claim Certificate'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation (during question flow) */}
        {!isSubmitted && (
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-app)',
            }}
          >
            <button
              type="button"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-default)',
                color: currentQIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ArrowLeft size={14} />
              <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                className="sahyog-btn"
              >
                <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next'}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--success-dark)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                className="sahyog-btn"
              >
                <CheckCircle size={14} />
                <span>{language === 'hi' ? 'टेस्ट सबमिट करें' : 'Submit Test'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
