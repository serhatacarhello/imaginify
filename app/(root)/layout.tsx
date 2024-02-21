import React, { ReactNode } from 'react'

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='root'>
            <div className="root-container">
                <div className="wrapper">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default RootLayout

