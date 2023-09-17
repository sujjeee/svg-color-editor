"use client"
import React, { useState } from 'react'
import xmlParser from 'xml-js';
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function page() {
    const [pathColors, setPathColors] = React.useState({});
    const [svgObject, setSvgObject] = useState(null);
    const [paths, setPaths] = useState([]);

    const [showEditor, setShowEditor] = useState(false);

    React.useEffect(() => {
        if (svgObject) {
            // @ts-ignore
            const gElements = svgObject.svg.g;
            // @ts-ignore
            let updatedPaths = [];

            if (gElements && Array.isArray(gElements.path)) {
                // @ts-ignore
                updatedPaths = [...updatedPaths, ...gElements.path];
                // @ts-ignore
            } else if (Array.isArray(svgObject.svg.path)) {
                // @ts-ignore
                updatedPaths = [...updatedPaths, ...svgObject.svg.path];
                // @ts-ignore
            } else if (svgObject.svg.path) {
                // @ts-ignore
                updatedPaths.push(svgObject.svg.path);
            }

            // @ts-ignore
            setPaths(updatedPaths);
        }
    }, [svgObject]);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const svgContent = event.target.result;
                const parsedSvgObject = xmlParser.xml2js(svgContent, { compact: true });

                // @ts-ignore
                setSvgObject(parsedSvgObject);
                setShowEditor(true);
                console.log("obj", svgObject)
                console.log("paths", paths)
            };
            reader.readAsText(file);
        }
    };


    // @ts-ignore
    const handleColorChange = (pathId, color) => {
        setPathColors({ ...pathColors, [pathId]: color });
    };

    const dynamicSvgString = `
        <svg
            viewBox="0 0 853 765"
            className=''
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            ${paths
            // @ts-ignore
            .map((path) => {
                // @ts-ignore
                const fill = pathColors[path._attributes.id] || path._attributes.fill;
                // @ts-ignore
                return `<path id="${path._attributes.id}" d="${path._attributes.d}" fill="${fill}" />`;
            })
            .join('')}

        </svg>
    `;
    return (
        <main className='flex justify-center items-center h-screen'>
            {!showEditor ? (
                <div>
                    <input type="file" accept=".svg" onChange={handleFileChange} />
                </div>
            ) : (
                <Card className='grid grid-cols-2 gap-2 max-w-[700px] w-full max-h-[400px] h-full'>
                    <div className=' rounded-l-md w-full h-full flex justify-center items-center p-6 '>
                        <div className='w-full h-full justify-center flex items-center rounded-md border border-gray-300'>
                            <svg dangerouslySetInnerHTML={{ __html: dynamicSvgString }} />
                        </div>
                    </div>
                    <div className='bg-greeb-500 rounded-r-md h-full w-full flex justify-center items-center '>
                        <div className='w-full h-full justify-center flex items-center rounded-r-md p-6 flex-col gap-4'>
                            {/* @ts-ignore  */}
                            {paths.map((path, index) => {
                                return (
                                    <div key={index} className="grid w-full max-w-sm items-center gap-1.5">
                                        {/*  @ts-ignore */}
                                        <Label htmlFor={path._attributes.id}>{path._attributes.id}</Label>
                                        <Input
                                            // @ts-ignore
                                            id={path._attributes.id}
                                            type="color"
                                            //  @ts-ignore 
                                            value={pathColors[path._attributes.id] || path._attributes.fill}
                                            // @ts-ignore
                                            onChange={(e) => handleColorChange(path._attributes.id, e.target.value)}
                                            className='p-0'
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            )}
        </main>
    )
}

