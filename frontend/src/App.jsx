import React, { useState, useEffect } from 'react';
import { api } from './api/client';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AddMeetingModal from './components/AddMeetingModal';
import AddContactModal from './components/AddContactModal';
import LearningModal from './components/LearningModal';

// Pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Meetings from './pages/Meetings';
import Prepare from './pages/Prepare';
import Memory from './pages/Memory';
import Settings from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState(null);

  // Modals & Overlays
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [modalContactId, setModalContactId] = useState(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [learningResult, setLearningResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadAllData = async () => {
    try {
      const [contactsData, meetingsData, statsData] = await Promise.all([
        api.getContacts(),
        api.getMeetings(),
        api.getSystemStats(),
      ]);
      setContacts(contactsData);
      setMeetings(meetingsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching application state:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const res = await api.seedDemoData();
      await loadAllData();
      showToast('Demo data seeded! Sarah Johnson Acme Corp storyline is live.', 'success');
    } catch (err) {
      console.error('Failed to seed demo:', err);
      showToast('Error seeding demo data: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSaveContact = async (contactPayload) => {
    setIsSubmitting(true);
    try {
      const created = await api.createContact(contactPayload);
      await loadAllData();
      setIsAddContactOpen(false);
      showToast(`Contact created! Hindsight bank '${created.hindsight_bank_id}' provisioned.`, 'success');
    } catch (err) {
      console.error('Failed to create contact:', err);
      showToast('Error creating contact: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact and their Hindsight memory bank?')) return;
    try {
      await api.deleteContact(contactId);
      await loadAllData();
      if (selectedContactId === contactId) {
        setSelectedContactId(null);
        setActiveTab('contacts');
      }
      showToast('Contact and Hindsight memory bank deleted.', 'info');
    } catch (err) {
      console.error('Failed to delete contact:', err);
      showToast('Error deleting contact: ' + err.message, 'error');
    }
  };

  const handleSaveMeeting = async ({ contact_id, title, location, notes, learnImmediately }) => {
    setIsSubmitting(true);
    try {
      const meeting = await api.createMeeting({
        contact_id,
        title,
        location,
        notes,
      });

      if (learnImmediately) {
        const learnRes = await api.learnFromMeeting(meeting.id);
        setLearningResult(learnRes);
        setIsLearningOpen(true);
      }

      await loadAllData();
      setIsAddMeetingOpen(false);
      showToast('Meeting logged and stored successfully!', 'success');
    } catch (err) {
      console.error('Failed to log meeting:', err);
      showToast('Error logging meeting: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerLearn = async (meetingId) => {
    try {
      showToast('Extracting knowledge & syncing to Hindsight...', 'info');
      const learnRes = await api.learnFromMeeting(meetingId);
      setLearningResult(learnRes);
      setIsLearningOpen(true);
      await loadAllData();
    } catch (err) {
      console.error('Failed to learn from meeting:', err);
      showToast('Error learning from meeting: ' + err.message, 'error');
    }
  };

  const handlePrepareContact = (contactId) => {
    setSelectedContactId(contactId);
    setActiveTab('prepare');
  };

  const handleSelectContact = (contactId) => {
    setSelectedContactId(contactId);
    setActiveTab('contactDetail');
  };

  const handleQuickSarahDemo = () => {
    const sarah = contacts.find(c => c.name.includes('Sarah'));
    if (sarah) {
      setSelectedContactId(sarah.id);
      setActiveTab('prepare');
    } else {
      handleSeedDemo().then(() => {
        const updatedSarah = contacts.find(c => c.name.includes('Sarah'));
        if (updatedSarah) {
          setSelectedContactId(updatedSarah.id);
          setActiveTab('prepare');
        }
      });
    }
  };

  const handleOpenAddMeeting = (contactId = null) => {
    setModalContactId(contactId);
    setIsAddMeetingOpen(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab === 'contactDetail' ? 'contacts' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'contacts') setSelectedContactId(null);
          setActiveTab(tab);
        }}
        onQuickDemo={handleQuickSarahDemo}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          activeTab={activeTab}
          onSeedDemo={handleSeedDemo}
          onOpenAddMeeting={() => handleOpenAddMeeting()}
          onOpenAddContact={() => setIsAddContactOpen(true)}
          isSeeding={isSeeding}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              contacts={contacts}
              meetings={meetings}
              onNavigate={setActiveTab}
              onPrepareContact={handlePrepareContact}
              onQuickSarahDemo={handleQuickSarahDemo}
              onOpenAddMeeting={() => handleOpenAddMeeting()}
            />
          )}

          {activeTab === 'contacts' && (
            <Contacts
              contacts={contacts}
              onSelectContact={handleSelectContact}
              onPrepareContact={handlePrepareContact}
              onOpenAddContact={() => setIsAddContactOpen(true)}
              onOpenAddMeeting={handleOpenAddMeeting}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'contactDetail' && selectedContactId && (
            <ContactDetail
              contactId={selectedContactId}
              onBack={() => setActiveTab('contacts')}
              onPrepareContact={handlePrepareContact}
              onOpenAddMeeting={handleOpenAddMeeting}
              onTriggerLearn={handleTriggerLearn}
            />
          )}

          {activeTab === 'meetings' && (
            <Meetings
              meetings={meetings}
              contacts={contacts}
              onOpenAddMeeting={handleOpenAddMeeting}
              onTriggerLearn={handleTriggerLearn}
              onPrepareContact={handlePrepareContact}
            />
          )}

          {activeTab === 'prepare' && (
            <Prepare
              contacts={contacts}
              selectedContactId={selectedContactId}
              onSelectContact={setSelectedContactId}
            />
          )}

          {activeTab === 'memory' && (
            <Memory
              contacts={contacts}
              selectedContactId={selectedContactId}
              onPrepareContact={handlePrepareContact}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              onSeedDemo={handleSeedDemo}
              isSeeding={isSeeding}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMeetingModal
        isOpen={isAddMeetingOpen}
        onClose={() => setIsAddMeetingOpen(false)}
        contacts={contacts}
        selectedContactId={modalContactId}
        onSaveMeeting={handleSaveMeeting}
        isSubmitting={isSubmitting}
      />

      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSaveContact={handleSaveContact}
        isSubmitting={isSubmitting}
      />

      <LearningModal
        isOpen={isLearningOpen}
        onClose={() => setIsLearningOpen(false)}
        learnResult={learningResult}
        onGoToPrepare={() => {
          if (learningResult?.contact_id) {
            setSelectedContactId(learningResult.contact_id);
            setActiveTab('prepare');
          }
        }}
      />

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
