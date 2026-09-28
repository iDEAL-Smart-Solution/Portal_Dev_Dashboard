import { useState, useEffect } from 'react';
import { useSystemStore } from '../../stores/systemStore';

export default function SystemSettingsPage() {
  const { costConfig, isLoading, error, fetchStudentCostConfig, createStudentCostConfig, updateStudentCostConfig, clearError } =
    useSystemStore();

  const [inputPrice, setInputPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchStudentCostConfig();
  }, [fetchStudentCostConfig]);

  // Pre-fill the input when we switch into edit mode
  useEffect(() => {
    if (isEditing && costConfig) {
      setInputPrice(String(costConfig.pricePerStudent));
    }
  }, [isEditing, costConfig]);

  const isConfigMissing = !costConfig || costConfig.pricePerStudent === 0;

  const handleOpenEditor = () => {
    setValidationError('');
    clearError();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setInputPrice('');
    setValidationError('');
    clearError();
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    const parsed = parseFloat(inputPrice);
    if (isNaN(parsed) || parsed <= 0) {
      setValidationError('Please enter a valid price greater than zero.');
      return;
    }
    setValidationError('');

    try {
      if (isConfigMissing) {
        await createStudentCostConfig(parsed);
      } else {
        await updateStudentCostConfig(parsed);
      }
      setIsEditing(false);
      setInputPrice('');
    } catch {
      // error is already set in the store; keep the form open so the user can retry
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? '—'
      : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Platform-wide configuration managed by the developer role.
        </p>
      </div>

      {/* Student Cost Configuration card */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Student Cost Configuration</h2>
              <p className="text-xs text-gray-500">Price charged per student slot when a school purchases a subscription via Suite</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={handleOpenEditor}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {isConfigMissing ? 'Set Price' : 'Edit'}
            </button>
          )}
        </div>

        {/* Card body */}
        <div className="px-6 py-5">
          {/* Loading state */}
          {isLoading && !isEditing && (
            <div className="flex items-center gap-3 py-4">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-sm text-gray-500">Loading configuration…</span>
            </div>
          )}

          {/* Store-level error */}
          {error && !isEditing && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Current value display */}
          {!isLoading && !isEditing && (
            <div className="space-y-4">
              {isConfigMissing ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">No configuration set</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      The system is using the built-in default of <strong>₦400</strong> per student.
                      Click <strong>Set Price</strong> to persist an explicit configuration.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Price per Student</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {formatCurrency(costConfig!.pricePerStudent)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(costConfig!.updatedAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 leading-relaxed">
                <strong>How this works:</strong> When Suite processes a school's payment, the Portal multiplies this
                price by the number of student slots purchased to validate the amount paid. Changing this value only
                affects future Suite payments — existing subscriptions are not recalculated.
              </div>
            </div>
          )}

          {/* Edit / Create form */}
          {isEditing && (
            <div className="space-y-4">
              <div>
                <label htmlFor="price-input" className="block text-sm font-medium text-gray-700 mb-1">
                  {isConfigMissing ? 'Set price per student' : 'New price per student'}
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                    ₦
                  </span>
                  <input
                    id="price-input"
                    type="number"
                    min="1"
                    step="1"
                    value={inputPrice}
                    onChange={(e) => {
                      setInputPrice(e.target.value);
                      setValidationError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="e.g. 400"
                    className={`w-full pl-8 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      validationError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    aria-describedby={validationError ? 'price-error' : undefined}
                    autoFocus
                  />
                </div>
                {validationError && (
                  <p id="price-error" className="mt-1 text-xs text-red-600" role="alert">
                    {validationError}
                  </p>
                )}
                {error && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {error}
                  </p>
                )}
              </div>

              {inputPrice && !validationError && parseFloat(inputPrice) > 0 && (
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600">
                  Preview: a school buying <strong>100 students</strong> would be charged{' '}
                  <strong>{formatCurrency(parseFloat(inputPrice) * 100)}</strong>.
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isConfigMissing ? 'Create Configuration' : 'Save Changes'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
