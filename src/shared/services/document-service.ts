export class DocumentService {

    private static _idNumber: number = 0;

    public static getElementById<T extends HTMLElement>(id: string): T {
        const result: HTMLElement | null = document.getElementById(id);
        if (result == null) {
            throw new Error("DocumentService.getElementById returned null for id '" + id + "'");
        }
        return result as T;
    }

    public static getFirstChild<T extends HTMLElement>(element: HTMLElement): T {
        return (element.firstElementChild as T);
    }

    public static removeAllChildren(element: HTMLElement): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    public static getChildWithClass<T extends HTMLElement>(element: HTMLElement, className: string): T {
        const children: HTMLCollection = element.children;
        for (let i: number = 0; i < children.length; i++) {
            if (children[i].classList.contains(className)) {
                return children[i] as T;
            }
        }
        throw new Error("DocumentService.getChildWithClass, element has no children with '" + className + "' class");
    }

    public static getAllChildren<T extends HTMLElement>(element: HTMLElement): T[] {
        const children: HTMLCollection = element.children;
        const result: T[] = [];
        for (let i: number = 0; i < children.length; i++) {
            result.push((children[i]) as T);
        }
        return result;
    }

    static get idNumber(): number {
        this._idNumber++;
        return this._idNumber;
    }
}