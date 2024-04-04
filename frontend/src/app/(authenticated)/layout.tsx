import React from 'react';

export default async function Layout({ children, params }: { children: React.ReactNode, params: any }) {
  return <div className="max-w-screen-lg w-full h-full mx-auto p-4">{children}</div>;
}
