import { Typography } from '@mui/material';
import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

class ErrorHandler extends Component<PropsWithChildren, { hasError: boolean }> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Uncaught error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <Typography variant="h1">Something went Wrong</Typography>
          <NavLink to={'/'}>Main Page</NavLink>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorHandler;
