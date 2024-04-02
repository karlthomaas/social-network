import React from 'react';

export default async function Layout({ children, params }: { children: React.ReactNode, params: any }) {
  return <div>{children}</div>;
}
