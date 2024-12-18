import { Counter } from "./Counter";
import { Movies } from "./Movies";
import { useQueryClient } from "@tanstack/solid-query";

export function Page() {
    return (
        <>
            <h1>My Vike + React app</h1>
            This page is:
            <ul>
                <li>Rendered to HTML.</li>
                <li>
                    Interactive while loading. <Counter/>
                </li>
            </ul>
            <Movies/>
        </>
    );
}
