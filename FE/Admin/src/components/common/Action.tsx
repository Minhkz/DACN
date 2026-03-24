'use client';

import { Modal } from '@/components/ui/modal';
import { notify } from '@/util/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin } from 'antd';
import { Eye, Trash2, Pencil } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const Action = () => {
  const [openView, setOpenView] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      <button
        type="button"
        title="View"
        onClick={() => setOpenView(true)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <Eye size={18} />
      </button>

      {/* Update */}
      <button
        type="button"
        title="Update"
        onClick={() => setOpenUpdate(true)}
        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
      >
        <Pencil size={18} />
      </button>

      {/* Delete */}
      <button
        type="button"
        title="Delete"
        onClick={() => setOpenDelete(true)}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        <Trash2 size={18} />
      </button>

      {/* View Modal */}
      <Modal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        className="max-w-lg"
      >
        view
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        className="max-w-lg"
      >
        update
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        className="max-w-lg"
      >
        delete
      </Modal>
    </div>
  );
};

export default Action;
