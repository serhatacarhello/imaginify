import Sidebar from '@/components/share/Sidebar'
import React, { ReactNode } from 'react'

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='root'>
            <Sidebar />
            {/* <MobileNav /> */}
            <div className="root-container">
                <div className="wrapper">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default RootLayout

