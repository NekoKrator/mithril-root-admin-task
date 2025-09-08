import { useLocation, useParams } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { useEffect } from 'react';
import { createVisit } from '../services/visti';

export default function NotePage() {
  const { noteId } = useParams();
  const currentUser = getCurrentUser();

  const location = useLocation();
  const currentPath = location.pathname.slice(6);

  console.log(currentPath);

  console.log(currentUser.email);

  useEffect(() => {
    createVisit(noteId!);
  });

  return <>{noteId}</>;
}
