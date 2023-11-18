import { generatePortalLink } from '@/actions/generatePortalLink';
import React from 'react'

function ManageAccountButton() {
  return (
    /* generatePortalLink currently broken - TODO FIX! */
    <form action={generatePortalLink}>
      <button
        type="submit"
        className="w-full text-center px-4 py-2 text-sm text-white"
      >
        Manage Billing
      </button>
    </form>
  );
}

export default ManageAccountButton