import { useLocation } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const ConditionalProgressBar = () => {
  const location = useLocation();
  
  // Only show progress bar on form pages, not on welcome page
  const showProgressBar = location.pathname !== '/';
  
  return showProgressBar ? <ProgressBar /> : null;
};

export default ConditionalProgressBar;