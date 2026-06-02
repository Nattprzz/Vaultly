import { Navigate, useParams } from 'react-router-dom';

export default function ExploreRedirect() {
  const { category, id } = useParams<{ category?: string; id?: string }>();
  if (category && id) return <Navigate to={`/catalog/${category}/${id}`} replace />;
  return <Navigate to={category ? `/catalog/${category}` : '/catalog'} replace />;
}
