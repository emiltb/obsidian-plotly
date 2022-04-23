import * as Plotly from 'plotly.js-dist-min';

import { MarkdownPostProcessorContext, parseYaml } from "obsidian";

export const preprocessor = (content: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    let json;
    try {
        json = parseYaml(content);
        validate(json, el)
        render(json, el)
    } catch (error) {
        let errorDiv = document.createElement('div');
        errorDiv.textContent = "Couldn't render plot:" + error;
        el.appendChild(errorDiv);
    }
}

const allowValues = ["data", "layout", "config"];

const validate = (json: any, el: HTMLElement) => {
    if (!json) {
        throw "There should be a valid JSON in this block."
    }

    Object.keys(json).forEach(key => {
        if (!allowValues.contains(key)) {
            throw "The only valid keys are data, layout and config."
        }
    })
}

const render = (json: any, el: HTMLElement) => {
    renderPlotly(el, json.data, json.layout, json.config)
}


function getWidth(): number {
    const collection: HTMLCollection = document.getElementsByClassName("markdown-preview-section");
    const firstElement = collection[0] as HTMLElement;
    var width = firstElement.offsetWidth;
    return width;
}

function getDefaultLayout(width: number): Partial<Plotly.Layout> {
    return {
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    autosize: false,
    width: width,
    height: width * 0.5,
    margin: {
        l: 20,
        r: 5,
        b: 20,
        t: 5,
        pad: 0
    },
    xaxis: {
        fixedrange: true,
        showgrid: true,
        zeroline: true,
        showline: true,
        gridcolor: '#ffffff',
        zerolinecolor: '#ffffff',
        linecolor: '#ffffff',
        tickfont: { color: '#ffffff' }
    },
    yaxis: {
        fixedrange: true,
        showgrid: true,
        zeroline: true,
        showline: true,
        gridcolor: '#ffffff',
        zerolinecolor: '#ffffff',
        linecolor: '#ffffff',
        tickfont: { color: '#ffffff' }
    }
}
};


export const renderPlotly = (el: HTMLElement, data: Object[], layout: Object, config: Object) => {
    const destination = document.createElement('div');

    let defaultLayout = getDefaultLayout(getWidth());

    let mergedLayout = {...defaultLayout, ...layout };

    if (el.firstElementChild != null) {
        Plotly.update(destination, data as any, mergedLayout as any, config as any);
        el.replaceChild(destination, el.firstElementChild);
    } else {
        Plotly.newPlot(destination, data, mergedLayout, config);
        el.appendChild(destination);
    }
}
