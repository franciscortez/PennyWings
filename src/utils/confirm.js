import Swal from 'sweetalert2';

/**
 * Returns a SweetAlert2 Confirmation mixin styled according to the current theme.
 * @param {string} theme - 'dark' or 'light'
 * @returns {Swal}
 */
export const getConfirm = (theme) => {
  const isDark = theme === 'dark';

  return Swal.mixin({
    background: isDark ? '#1F2937' : '#ffffff', // dark:bg-dark-card or white
    color: isDark ? '#F9FAFB' : '#111827',      // dark:text-white or Gray 900
    confirmButtonColor: '#EC4899',               // Pink 500
    cancelButtonColor: '#94A3B8',                // Slate 400
    reverseButtons: false,
    customClass: {
      popup: `rounded-[2.5rem] p-8 border ${isDark ? 'border-gray-700 shadow-2xl shadow-black/50' : 'border-pink-50 shadow-lg'}`,
      title: 'text-2xl font-black tracking-tight mb-2',
      htmlContainer: 'text-base font-medium opacity-80 mb-4',
      confirmButton: 'rounded-2xl px-8 py-4 font-black tracking-tight text-sm uppercase mr-2',
      cancelButton: 'rounded-2xl px-6 py-4 font-black tracking-tight text-sm uppercase'
    }
  });
};

/**
 * Common confirmation presets
 */
export const confirmPresets = {
  logout: {
    title: 'Wait! Leaving?',
    text: 'Are you sure you want to sign out? Your pennies will miss you!',
    icon: 'warning',
    confirmButtonText: 'Yes, Log Me Out',
    cancelButtonText: 'Cancel',
    showCancelButton: true
  },
  deleteItem: (itemName = 'item') => ({
    title: `Delete ${itemName}?`,
    text: "Every penny counts! This action cannot be undone.",
    icon: 'warning',
    confirmButtonText: 'Yes, Delete It',
    cancelButtonText: 'Cancel',
    showCancelButton: true,
    confirmButtonColor: '#F43F5E' // rose-500 for destructive actions
  })
};
