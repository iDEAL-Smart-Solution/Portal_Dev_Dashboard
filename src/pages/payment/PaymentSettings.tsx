import { useState, useEffect } from 'react';
import { Download, ShieldAlert } from 'lucide-react';
import axiosInstance from '../../config/axios';
import { showError } from '../../lib/notifications';
import { useBackupStore } from '../../stores/backupStore';

type Bank = {
  id: number;
  name: string;
  code: string;
};

type School = {
  id: string;
  schoolName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

type PaymentAccount = {
  schoolId: string;
  schoolName: string;
  paystackSubaccountCode: string | null;
  paystackAccountName: string | null;
  paystackBankCode: string | null;
  paystackAccountNumber: string | null;
  paystackEnabled: boolean;
  paystackConnectedAt: string | null;
};

type ResolvedAccount = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
};

export default function PaymentSettings() {
  const downloadDatabaseBackup = useBackupStore((state) => state.downloadDatabaseBackup);
  const backingUp = useBackupStore((state) => state.isLoading);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolving, setResolving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [resolvedAccount, setResolvedAccount] = useState<ResolvedAccount | null>(null);

  useEffect(() => {
    fetchSchools();
    fetchBanks();
    fetchPaymentAccounts();
  }, []);

  const fetchPaymentAccounts = async () => {
    try {
      const response = await axiosInstance.get<{ data: PaymentAccount[] }>('/Payment/payment-accounts');
      setPaymentAccounts(response.data.data || []);
    } catch (error) {
      console.error('Failed to load payment accounts');
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axiosInstance.get<School[]>('/School/get-all');
      setSchools(response.data || []);
    } catch (error) {
      console.error('Failed to load schools list');
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axiosInstance.get<{ data: Bank[] }>('/Payment/get-banks');
      setBanks(response.data.data || []);
    } catch (error) {
      console.error('Failed to load banks list');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleResolveAccount = async () => {
    if (!selectedBankCode || !accountNumber) {
      alert('Please select a bank and enter account number');
      return;
    }

    setResolving(true);
    setResolvedAccount(null);

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        accountName: string;
        message: string;
      }>('/Payment/resolve-account', {
        bankCode: selectedBankCode,
        accountNumber,
      });

      if (response.data.success) {
        setResolvedAccount({
          accountName: response.data.accountName,
          accountNumber,
          bankCode: selectedBankCode,
        });
      } else {
        alert(response.data.message || 'Unable to verify account');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify account');
    } finally {
      setResolving(false);
    }
  };

  const handleConnectPaystack = async () => {
    if (!resolvedAccount || !selectedSchoolId) {
      alert('Please select a school and verify the account first');
      return;
    }

    setConnecting(true);

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
      }>(`/Payment/connect-paystack?schoolId=${selectedSchoolId}`, {
        bankCode: resolvedAccount.bankCode,
        accountNumber: resolvedAccount.accountNumber,
      });

      if (response.data.success) {
        alert(response.data.message);
        setSelectedSchoolId('');
        setSelectedBankCode('');
        setAccountNumber('');
        setResolvedAccount(null);
        fetchPaymentAccounts(); // Refresh the list
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to connect Paystack account');
    } finally {
      setConnecting(false);
    }
  };

  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleBackupDatabase = async () => {
    if (backingUp) return;

    try {
      const { blob, filename } = await downloadDatabaseBackup();
      triggerBrowserDownload(blob, filename);
    } catch (error: any) {
      const message = error?.response?.status === 401
        ? 'Your session expired. Please sign in again to download the backup.'
        : error?.response?.data?.message || error?.message || 'Failed to create database backup';

      showError(message);
      console.error('Database backup download failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-gray-600 mt-2">
          Connect bank accounts to receive payments from students
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Database Backup</h2>
              <p className="mt-1 text-sm text-gray-600">
                Download a full database backup from the portal API.
              </p>
            </div>
          </div>

          <button
            onClick={handleBackupDatabase}
            disabled={backingUp}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <Download className="h-4 w-4" />
            <span>{backingUp ? 'Downloading Backup...' : 'Backup Database'}</span>
          </button>
        </div>
      </div>

      {/* Linked Accounts Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Linked Payment Accounts</h2>
          <p className="text-sm text-gray-600 mt-1">
            Schools with connected Paystack subaccounts
          </p>
        </div>
        <div className="p-6">
          {loadingAccounts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : paymentAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment accounts connected yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subaccount Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentAccounts.map((account) => (
                    <tr key={account.schoolId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {account.schoolName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {account.paystackAccountName || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {account.paystackAccountNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-gray-600">
                        {account.paystackSubaccountCode || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {account.paystackConnectedAt
                          ? new Date(account.paystackConnectedAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Connect New Account Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connect New Account</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select a school and enter bank details to set up automated payment collection
          </p>
        </div>

        {/* School Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select School *</label>
          <select
            value={selectedSchoolId}
            onChange={(e) => {
              setSelectedSchoolId(e.target.value);
              setResolvedAccount(null);
            }}
            disabled={loadingSchools}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{loadingSchools ? 'Loading schools...' : 'Select a school'}</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.schoolName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Bank</label>
          <select
            value={selectedBankCode}
            onChange={(e) => setSelectedBankCode(e.target.value)}
            disabled={loadingBanks || !selectedSchoolId}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">{loadingBanks ? 'Loading banks...' : 'Select your bank'}</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Account Number</label>
          <input
            type="text"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength={10}
            disabled={!selectedSchoolId}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleResolveAccount}
          disabled={!selectedSchoolId || !selectedBankCode || accountNumber.length !== 10 || resolving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {resolving ? 'Verifying...' : 'Verify Account'}
        </button>

        {resolvedAccount && (
          <div className="border border-green-200 bg-green-50 rounded p-4">
            <p className="font-semibold text-green-900 mb-2">Account Verified ✓</p>
            <p className="text-sm text-green-800">
              <strong>Account Name:</strong> {resolvedAccount.accountName}
            </p>
            <p className="text-sm text-green-800">
              <strong>Account Number:</strong> {resolvedAccount.accountNumber}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Please confirm this is the correct account for <strong>{schools.find(s => s.id === selectedSchoolId)?.schoolName}</strong> before connecting.
            </p>
          </div>
        )}

        {resolvedAccount && (
          <button
            onClick={handleConnectPaystack}
            disabled={connecting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Confirm & Connect Account'}
          </button>
        )}

        <div className="border border-blue-200 bg-blue-50 rounded p-4 text-sm text-blue-800">
          By connecting an account, you authorize us to create a Paystack subaccount for the selected school.
          Student payments will be automatically split and sent to this account.
        </div>
      </div>
    </div>
  );
}
