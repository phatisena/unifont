namespace unikind {
    let nextKind: number;

    export function create() {
        if (nextKind === undefined) nextKind = 0;
        return nextKind++;
    }

    export function remove(id:number) {
        const kindname = unikind[id]
        unikind[id] = undefined;
        if (nextkind <= 0) return;
        nextKind--;
    }
  
    export function rename(id:number,newkind:string) {
        const kindname = unikind[id]
        if (kindname === newkind) return;
        unikind[id] = newkind
        return id;
    }
  
    //% isKind
    export const Score = create();

    //% isKind
    export const Lives = create();
}

namespace unienum {
    /**
     * A type of state to get for a unifont sprite
     */
    //% shim=KIND_GET
    //% blockId=unifont_getunispritekind
    //% block="$kind"
    //% kindNamespace=unikind
    //% kindMemberName=unikind
    //% kindPromptHint="e.g. Cooldown, Speed, Attack..."
    //% blockHidden
    export function _uniKind(kind: number): number {
        return kind;
    }
}
