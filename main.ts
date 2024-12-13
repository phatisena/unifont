
namespace SpriteKind {
    export const _unifont = SpriteKind.create()
    export const _unisrc = SpriteKind.create()
}
//%block="UniFont"
//%color="#12d48a" 
//%icon="\uf031"
//%weight=3
namespace unifont {

    let rendering = false; export let ligs: string[][] = []; export let ligages: Image[][] = []; export let ligwidth: number[][] = []; export let ligsubw: number[][] = []; export let ligdir: number[][] = []; export let ligcol: number[][] = []; export let ligul: number[][] = []; export let storeid: number[] = []; export let letterspace: number = 1; export let curid = 0; export let lineheight = 1;

    export function newtableid() {
        storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligsubw.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1; return storeid.length - 1;
    }

    export function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
    }

    export function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj))) { return true }
        return false
    }

    export function deepChar(tid: number = 0, idx: number = 0, charstr: string = "") {
        let ustr = charstr.charAt(idx)
        let ic = 1
        let uc = charstr.charAt(idx + ic)
        let istr = "" + ustr + uc
        if (ligs[tid].indexOf(istr) < 0) { return ustr }
        while (ligs[tid].indexOf(istr) >= 0) {
            ustr = "" + ustr + uc
            ic++
            uc = charstr.charAt(idx + ic)
            istr = "" + ustr + uc
            if (idx + ic >= charstr.length) { break }
        }
        return ustr
    }
    
    export function drawOutline(Inputi: Image, color: number, dir8: boolean) {
        let dxl: number[] = [1,0,-1,0]
        let dyl: number[] = [0,1,0,-1]
        if (dir8) {
            dxl = [1,1,1,0,-1,-1,-1,0]
            dyl = [1,0,-1,-1,-1,0,1,1]
        }
        let Uinputi = Inputi.clone()
        for (let curcol = 1;curcol < 16; curcol++) {
            Uinputi.replace(curcol,color)
        }
        let Outputi = image.create(Inputi.width+2,Inputi.height+2)
        for (let curdir = 0; curdir < Math.min(dxl.length,dyl.length); curdir++) {
            drawTransparentImage(Uinputi,Outputi,1+dxl[curdir],1+dyl[curdir])
        }
        drawTransparentImage(Inputi,Outputi,1,1)
        return Outputi
    }

    export function SetImgFrame(ImgF: Image, Wh: number, Ht: number) {
        let ImgOutput = image.create(Wh, Ht)
        let Twidt = Math.floor(ImgF.width / 3)
        let Theig = Math.floor(ImgF.height / 3)
        let ImgTable: Image[] = []
        let Uimg: Image = null
        let sw = 0
        let sh = 0
        for (let hj = 0; hj < 3; hj++) {
            for (let wi = 0; wi < 3; wi++) {
                Uimg = image.create(Twidt, Theig)
                drawTransparentImage(ImgF, Uimg, 0 - wi * Twidt, 0 - hj * Theig)
                ImgTable.push(Uimg.clone())
            }
        }
        for (let wi = 0; wi < Math.floor(Wh / Twidt); wi++) {
            for (let hj = 0; hj < Math.floor(Ht / Theig); hj++) {
                sw = Math.min(wi * Twidt, Wh - Twidt)
                sh = Math.min(hj * Theig, Ht - Theig)
                if (hj == 0 && wi == 0) {
                    drawTransparentImage(ImgTable[0], ImgOutput, sw, sh)
                } else if (hj == Math.floor(Ht / Theig) - 1 && wi == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[8], ImgOutput, sw, sh)
                } else if (hj == Math.floor(Ht / Theig) - 1 && wi == 0) {
                    drawTransparentImage(ImgTable[6], ImgOutput, sw, sh)
                } else if (hj == 0 && wi == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[2], ImgOutput, sw, sh)
                } else {
                    if (wi > 0 && wi < Math.floor(Wh / Twidt) - 1) {
                        if (hj == 0) {
                            drawTransparentImage(ImgTable[1], ImgOutput, sw, sh)
                        } else if (hj == Math.floor(Ht / Theig) - 1) {
                            drawTransparentImage(ImgTable[7], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else if (hj > 0 && hj < Math.floor(Ht / Theig) - 1) {
                        if (wi == 0) {
                            drawTransparentImage(ImgTable[3], ImgOutput, sw, sh)
                        } else if (wi == Math.floor(Wh / Twidt) - 1) {
                            drawTransparentImage(ImgTable[5], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else {
                        drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                    }
                }
            }
        }
        return ImgOutput
    }

    /**
     * add charcter glyph to the table
     */
    //%blockid=unifont_setcharecter
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    //%weight=2
    export function setCharecter(gid: number = 0, glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, bcol: number = 0, scol: number = 0, mcol: number = 0, ncol: number = 0) {
        let tid = 0
        if (storeid.indexOf(gid) < 0) {
            tid = newtableid()
        } else {
            tid = gid
        }

        let sncol = true; let scnwidt = true; let scwidt = false; let wi = 0; let wj = 0; let si = 0; let imgj = image.create(imgi.width, imgi.height);
        if (bcol > 0 && bcol < 16) {
            imgi.replace(bcol, 0)
        }
        for (let xw = 0; xw < imgi.width; xw++) {
            si = 0
            for (let yh = 0; yh < imgi.height; yh++) {
                if (imgi.getPixel(xw, yh) != 0 || (scwidt && imgi.getPixel(xw + 1, yh) != 0)) { si += 1 }
            }
            if (scnwidt) {
                if (scwidt) {
                    if (si <= 0) { wj = xw; scnwidt = false; }
                } else {
                    if (si > 0) { wi = xw; scwidt = true; }
                }
            }
        }
        if (scnwidt) { wj = imgi.width; scnwidt = false; }
        imgj = image.create(Math.abs(wj - wi), imgi.height); drawTransparentImage(imgi, imgj, 0 - wi, 0);
        if (scol > 0 && scol < 16) {
            imgj.replace(scol, 0)
        }
        let uwid = 0
        if (inchar) {
            for (let xw = imgi.width - 1; xw >= 0; xw--) {
                si = 0
                for (let yh = 0; yh < imgi.height; yh++) {
                    if (imgi.getPixel(xw, yh) != 0) { si += 1 }
                }
                if (scnwidt) {
                    if (scwidt) {
                        if (si <= 0) { wj = xw; scnwidt = false; }
                    } else {
                        if (si > 0) { wi = xw; scwidt = true; }
                    }
                }
            }
            if (scnwidt) { wj = imgi.width; scnwidt = false; }
            uwid = Math.abs(wj - wi)
        }

        if (ligs[tid].indexOf(glyph) < 0) {
            ligul[tid].push(ncol)
            ligcol[tid].push(mcol)
            ligs[tid].push(glyph); ligages[tid].push(imgj);
            if (notmove) {
                if (onthechar) {
                    ligdir[tid].push(10)
                } else {
                    ligdir[tid].push(-10)
                }
                ligwidth[tid].push(0)
                ligsubw[tid].push(0)
            } else {
                if (uwid == 0) {
                    ligsubw[tid].push(imgj.width)
                } else {
                    ligsubw[tid].push(uwid)
                }
                ligwidth[tid].push(imgj.width)
                ligdir[tid].push(0)
            }
        } else {
            ligul[tid][ligs[tid].indexOf(glyph)] = ncol
            ligcol[tid][ligs[tid].indexOf(glyph)] = mcol
            ligages[tid][ligs[tid].indexOf(glyph)] = imgj
            if (notmove) {
                if (onthechar) {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = 10
                } else {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = -10
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = 0
                ligsubw[tid][ligs[tid].indexOf(glyph)] = 0
            } else {
                if (uwid == 0) {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = imgj.width
                } else {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = uwid
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = imgj.width
                ligdir[tid][ligs[tid].indexOf(glyph)] = 0
            }
        }
    }

    /**
     * add more glyph
     * from charcter sheet
     * to the table
     */
    //%blockid=unifont_setcharfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=4
    export function setCharFromSheet(tid: number = 0, PngSheet: Image = image.create(10, 16), GroupChar: string = "", StayChar: string = "", CharOnChar: string = "", CharSubW: string = "", twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid = Math.round(PngSheet.width / twid); let uig = image.create(twid, thei); let txi = 0; let tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(tid, GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), CharOnChar.includes(GroupChar.charAt(tvn)), CharSubW.includes(GroupChar.charAt(tvn)), bcl, scl, mcl, ncl);
        }
    }

    /**
     * add more long glyph array
     * from charcter sheet
     * to the table
     */
    //%blockid=unifont_setchararrfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with array of letters $GroupChar||and | array of staying letters $StayChar array of letters on the letters $CharOnChar and array of Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=6
    export function setCharArrFromSheet(tid: number = 0, PngSheet: Image = image.create(10, 16), GroupChar: string[] = [], StayChar: string[] = [], CharOnChar: string[] = [], CharSubW: string[] = [], twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid = Math.round(PngSheet.width / twid); let uig = image.create(twid, thei); let txi = 0; let tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(tid, GroupChar[tvn], uig, StayChar.indexOf(GroupChar[tvn]) >= 0, CharOnChar.indexOf(GroupChar[tvn]) >= 0, CharSubW.indexOf(GroupChar[tvn]) >= 0, bcl, scl, mcl, ncl);
        }
    }

    /**
     * read the length of
     * my charcter in table
     */
    //%blockid=unifont_numofglyphs
    //%block="number of glyphs ||in table id $tid"
    //%group="datainfo"
    //%weight=2
    export function NumOfGlyphs(tid: number = 0): number {
        return ligs[tid].length
    }

    /**
     * read the array charcter image
     * of my table
     */
    //%blockid=unifont_arrofgypimg
    //%block="array of glyph images ||in table id $tid"
    //%group="datainfo"
    //%weight=4
    export function ImageArray(tid: number = 0): Image[] {
        return ligages[tid]
    }

    /**
     * read the array charcter
     * of my table
     */
    //%blockid=unifont_arrofglyphs
    //%block="array of glyphs ||in table id $tid"
    //%group="datainfo"
    //%weight=6
    export function GlyphArray(tid: number = 0): String[] {
        return ligs[tid]
    }

    export function SetTextImgValue(arrm: boolean,input: string, iwidt: number, tid: number, icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false, spacew: number = undefined, lineh: number = undefined) {
        if (rendering) { if (arrm) { return [image.create(1,1)] as Image[] } else { return image.create(1,1) as Image } }
        rendering = true
        if (lineh == undefined) { lineh = lineheight}
        if (spacew == undefined) { spacew = letterspace}
        let curchar = ""; let curchar2 = ""; let uhei = 0; let outputarr: Image[] = []; let lnwit: number[] = []; let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            curchar = deepChar(tid, currentletter, input)
            if (!(ligs[tid].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid][(ligs[tid].indexOf(curchar))]
                if (ligwidth[tid][(ligs[tid].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid, currentletter + 1, input)
                if (curchar2 && Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid][ligs[tid].indexOf(curchar)] - Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar)] - ligwidth[tid][ligs[tid].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(curchar))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter))) && (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter + (curchar.length - 1) >= input.length - 1)) {
                    wie += spacew
                }
                hvi = ligages[tid][(ligs[tid].indexOf(curchar))].height
            } else if (input.charAt(currentletter) == " ") {
                wie += 3 * spacew
            } else {
                wie += 2 * spacew
            }
            uhei = Math.max(uhei, hvi)
            heig = Math.max(heig, hie + hvi)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += lineh
                    wie = 0;
                    if (findCommand(input, "n", currentletter)) {
                        currentletter += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter)) {
                currentletter += 2
            }
            if (curchar.length - 1 > 0) { currentletter += curchar.length - 1 }
        }
        wie = 0; widt = 0; let hix = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            curchar = deepChar(tid, currentletter2, input)
            if (!(ligs[tid].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid][(ligs[tid].indexOf(curchar))]
                if (ligwidth[tid][(ligs[tid].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter2 + curchar.length, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid, currentletter2 + 1, input)
                if (curchar2 && Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid][ligs[tid].indexOf(curchar)] - Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar)] - ligwidth[tid][ligs[tid].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid][(ligs[tid].indexOf(curchar))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter2))) && (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter2 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter2 + (curchar.length - 1) >= input.length - 1)) {
                    wie += spacew
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * spacew
            } else {
                wie += 2 * spacew
            }
            if (false) { widt = Math.max(widt, wie) }
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter2)) {
                    if (debugalm && findCommand(input, "n", currentletter2)) {
                        wie -= (3 * letterspace) + letterspace; widt = Math.max(widt, wie)
                    } else {
                        widt = Math.max(widt, wie)
                    }
                    lnwit.push(wie); wie = 0; hix += 1
                    if (findCommand(input, "n", currentletter2)) {
                        currentletter2 += 2
                    }
                } else {
                    widt = Math.max(widt, wie)
                }
            } else if (findCommand(input, "n", currentletter2)) {
                widt = Math.max(widt, wie); currentletter2 += 2;
            } else {
                widt = Math.max(widt, wie)
            }
            if (curchar.length - 1 > 0) { currentletter2 += curchar.length - 1 }
        }
        if (hix > 0 && debugalm) { wie += letterspace + (3 * letterspace) }; wie -= letterspace; lnwit.push(wie);
        let hgi = 0; let limg = image.create(lnwit[hgi], heig); let scwidt = true; let underc = false; let sc = 0; let scnwidt = false; let rimg = image.create(8, 8); let output = image.create(widt, heig); hie = 0; wie = 0; curwidt = 0;
        let uoutput: Image = image.create(output.width,output.height)
        if (bcol > 0) { uoutput = image.create(output.width+2,output.height+2) }
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            wie = 0; curchar = deepChar(tid, currentletter3, input)
            if (!(ligs[tid].indexOf(curchar) < 0)) {
                hvi = ligages[tid][(ligs[tid].indexOf(curchar))].height; uwidt = ligwidth[tid][(ligs[tid].indexOf(curchar))];
                if (ligwidth[tid][(ligs[tid].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid][(ligs[tid].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                scwidt = false; scnwidt = false; wie = 0; rimg = ligages[tid][(ligs[tid].indexOf(curchar))].clone(); let ccol = ligul[tid][ligs[tid].indexOf(input.charAt(currentletter3))];
                if (ligwidth[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] == 0) {
                    rimg.replace(ccol, ligcol[tid][ligs[tid].indexOf(curchar)])
                } else if (ligwidth[tid][ligs[tid].indexOf(curchar)] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] < 0) {
                    rimg.replace(ccol, 0)
                } else if (ligwidth[tid][ligs[tid].indexOf(curchar)] > 0 && ligdir[tid][ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0) {
                    rimg.replace(ccol, ligcol[tid][ligs[tid].indexOf(curchar)])
                }
                if (Math.abs(ligdir[tid][ligs[tid].indexOf(curchar)]) > 0 && Math.abs(ligdir[tid][ligs[tid].indexOf(input.charAt(Math.max(currentletter3 - 1, 0)))]) == 0) {
                    sc = 1; wie = 0;
                    while (sc > 0) {
                        sc = 0
                        for (let yh = 0; yh < rimg.height; yh++) {
                            if (limg.getPixel((curwidt - letterspace) - wie, yh) == rimg.getPixel(rimg.width - 1, yh) && (limg.getPixel((curwidt - letterspace) - wie, yh) != 0 && limg.getPixel((curwidt - letterspace) - wie, yh) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                if (wie < 0) { wie = Math.abs(wie) }
                drawTransparentImage(rimg, limg, curwidt - (nwidt + wie), 0 + (hvi - ligages[tid][(ligs[tid].indexOf(curchar))].height))
                if (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid, currentletter3 + 1, input)
                if (curchar2 && Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]) > 0) {
                    curwidt += Math.abs(ligwidth[tid][ligs[tid].indexOf(curchar)] - Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar2)] - ligwidth[tid][ligs[tid].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid][ligs[tid].indexOf(curchar)] - ligwidth[tid][ligs[tid].indexOf(curchar)]) > 0) {
                    curwidt += ligsubw[tid][(ligs[tid].indexOf(curchar))]
                } else if (ligwidth[tid][(ligs[tid].indexOf(curchar))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter3))) && (ligwidth[tid][(ligs[tid].indexOf(input.charAt(Math.min(currentletter3 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter3 + (curchar.length - 1) >= input.length - 1)) {
                    curwidt += spacew
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * spacew
            } else {
                curwidt += 2 * spacew
            }
            uhei = Math.max(uhei, hvi)
            if (alm < 0) {
                drawTransparentImage(limg.clone(), output, 0, hie)
            } else if (alm > 0) {
                drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
            } else if (alm == 0) {
                drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
            }
            if (icol > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    output.replace(ico, icol)
                }
            }
            if (bcol > 0) {uoutput = drawOutline(output.clone(),bcol,true) } else { uoutput = output.clone() }
            outputarr.push(uoutput.clone())
            if (iwidt > 0) {
                if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                    if (alm < 0) {
                        drawTransparentImage(limg.clone(), output, 0, hie)
                    } else if (alm > 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    hgi += 1; limg = image.create(lnwit[hgi], heig); curwidt = 0;
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += lineh
                    if (findCommand(input, "n", currentletter3)) {
                        currentletter3 += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter3)) {
                currentletter3 += 2
            }
            if (curchar.length - 1 > 0) { currentletter3 += curchar.length - 1 }
        }
        if (alm < 0) {
            drawTransparentImage(limg.clone(), output, 0, hie)
        } else if (alm > 0) {
            drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
        } else if (alm == 0) {
            drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
        }
        if (icol > 0) {
            for (let ico = 1; ico < 16; ico++) {
                output.replace(ico, icol)
            }
        }
        if (bcol > 0) { uoutput = drawOutline(output,bcol,true) } else { uoutput = output.clone() }
        outputarr.push(uoutput.clone())
        rendering = false
        if (arrm) { return outputarr as Image[] }
        output = uoutput.clone()
        return output as Image
    }
    
    /**
     * render text from my table
     * to the image
     */
    //%blockid=unifont_setimgfromtext
    //%block="create the image of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function SetTextImage(input: string, iwidt: number, tid: number, icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false,spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(false, input, iwidt, tid, icol, bcol, alm, debugalm, spacew, lineh) as Image
    }

    /**
     * render text from my table
     * like basic text animation
     * to image array
     */
    //%blockid=unifont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function SetTextImageArray(input: string, iwidt: number, tid: number, icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false, spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(true, input, iwidt, tid, icol, bcol, alm, debugalm, spacew, lineh) as Image[]
    }

    /** 
     * render text
     * and stamp to 
     * my dialog frame
     */
    //%blockid=unifont_stamptexttoframe
    //%block="StampStrImgToTheDialogFrame $Fimg=dialog_image_picker Text $Txt Text width $Wval TableId $arrid||And text color col $ucol and outline $bcol Alignment $ualm"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function StampStrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
        let StrImg: Image = SetTextImage(Txt, Wval, arrid, ucol, bcol, ualm, false, spacew, lineh)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = SetImgFrame(Fimg, StrImg.width + ((gapw * 2) + Math.floor(gapw / 2)), StrImg.height + ((gaph * 2) + Math.floor(gaph / 2)))
        drawTransparentImage(StrImg.clone(), UfImg, gapw, gaph)
        return UfImg
    }

    /**
     * render text
     * like basic text animation
     * and stamp to 
     * my dialog frame
     * as image array
     */
    //%blockid=unifont_stamptextarrtoframe
    //%block="StampStrAnimToDialogFrame $Fimg=dialog_image_picker Text input $Txt In text width $Wval At table id $arrid||and text color $ucol with outline $bcol And alignment $ualm "
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function StampStrArrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, bcol: number = 0, ualm: number = 0,spacew: number = 0, lineh: number = 0) {
        let StrImg: Image[] = SetTextImageArray(Txt, Wval, arrid, ucol, bcol, ualm, false, spacew, lineh)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = SetImgFrame(Fimg, StrImg[0].width + ((gapw * 2) + Math.floor(gapw / 2)), StrImg[0].height + ((gaph * 2) + Math.floor(gaph / 2)))
        let imgArr: Image[] = []
        let uimg: Image = null
        for (let mgi = 0; mgi < StrImg.length; mgi++) {
            uimg = UfImg.clone()
            drawTransparentImage(StrImg[mgi].clone(), uimg, gapw, gaph)
            imgArr.push(uimg)
        }
        return imgArr
    }

    /**
     * set the letterspace by value
     */
    //%blockid=unifont_setletterspacing
    //%block="set letter spacing to $input"
    //%group="modify"
    //%weight=8
    export function SetSpace(input: number) {
        letterspace = input
    }

    /**
     * change the letterspace by value
     */
    //%blockid=unifont_changeletterspacing
    //%block="change letter spacing by $input"
    //%group="modify"
    //%weight=6
    export function ChangeSpace(input: number) {
        letterspace += input
    }

    /**
     * set the line gap by value
     */
    //%blockid=unifont_setlinegap
    //%block="set line gap by $input"
    //%group="modify"
    //%weight=4
    export function SetLine(input: number) {
        lineheight = input
    }

    /**
     * change the line gap by value
     */
    //%blockid=unifont_changelinegap
    //%block="change line gap by $input"
    //%group="modify"
    //%weight=2
    export function ChangeLine(input: number) {
        lineheight += input
    }

    export enum align { left, center, right }

    /**
     * get alignment value
     */
    //%blockid=unifont_getalignmentval
    //%block="get $alg of alignment"
    //%group="modify"
    export function getAlign(alg: align) {
        switch (alg) {
            case align.left:
                return -1;
            case align.center:
                return 0;
            case align.right:
                return 1;
            default:
                return 0;
        }
    }

    export enum tempfont { MainFont, ArcadeFont }

    /**
     * set charcter
     * from template
     */
    //%blockid=unifont_presetfont
    //%block="SetupPresetFont $tempf ||with table id $tid"
    //%group="create"
    //%weight=10
    export function SetupPresetFont(tempf: tempfont, tid: number = 0) {
        switch (tempf) {
            case tempfont.MainFont:
                unidata.mainfont(tid)
                break;
            case tempfont.ArcadeFont:
                unidata.arcadefont(tid)
                break;
            default:
                unidata.mainfont(tid)
                break;
        }
    }

    export function spriteUpdate(Spr: Sprite ) {
        if (!(Spr)) { return; }
        if (sprdata.readDataImage(Spr,"sdim")) {
            sprdata.setDataImage(Spr, "nextimg", StampStrToDialog(sprdata.readDataImage(Spr, "sdim"), sprdata.readDataString(Spr, "stxt"), sprdata.readDataNumber(Spr,"stxw"),sprdata.readDataNumber(Spr,"stid"),sprdata.readDataNumber(Spr,"scol"),sprdata.readDataNumber(Spr,"socol"),sprdata.readDataNumber(Spr,"salg"),sprdata.readDataNumber(Spr,"spacew"),sprdata.readDataNumber(Spr,"lineh")))
        } else {
            sprdata.setDataImage(Spr, "nextimg", SetTextImage(sprdata.readDataString(Spr, "stxt"),sprdata.readDataNumber(Spr,"stxw"),sprdata.readDataNumber(Spr,"stid"),sprdata.readDataNumber(Spr,"scol"),sprdata.readDataNumber(Spr,"socol"),sprdata.readDataNumber(Spr,"salg"),false,sprdata.readDataNumber(Spr,"spacew"),sprdata.readDataNumber(Spr,"lineh")))
        }
        if (Spr.image.equals(sprdata.readDataImage(Spr,"nextimg"))) { return; }
        Spr.setImage(sprdata.readDataImage(Spr,"nextimg"))
    }

    export enum SprDataType {Tcol,Bcol,Tid,PageW,Talg}

    //%blockid=unifont_sprite_create
    //%block="create unifont sprite as $Text in color $Col with outline $Bcol in alignment $alg||and page width $PageW and tableid $Tid"
    //%Col.shadow=colorindexpicker
    //%Bcol.shadow=colorindexpicker
    //%blockSetVariable="myUnifont"
    //%group="sprite mode"
    //%weight=22
    export function newUnifontSprite(Text: string = "",Col: number , Bcol: number,alg: align,PageW: number = 0, Tid: number = 0) {
        let _UnifontSprite = sprites.create(img`
            .
        `, SpriteKind._unifont)
        sprdata.setDataString(_UnifontSprite,"stxt",Text)
        sprdata.setDataNumber(_UnifontSprite,"scol",Col)
        sprdata.setDataNumber(_UnifontSprite,"stid",Tid)
        sprdata.setDataNumber(_UnifontSprite,"stxw",PageW)
        sprdata.setDataNumber(_UnifontSprite,"salg",getAlign(alg))
        sprdata.setDataNumber(_UnifontSprite,"spacew",undefined)
        sprdata.setDataNumber(_UnifontSprite,"lineh",undefined)
        sprdata.setDataNumber(_UnifontSprite,"socol",Bcol)
        spriteUpdate(_UnifontSprite)
        _UnifontSprite.setPosition(Math.floor(scene.screenWidth() / 2), Math.floor(scene.screenHeight() / 2))
        return _UnifontSprite
    }
    
    //%blockid=unifont_sprite_readtxt
    //%block="get $myUnifont as text data"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=18
    export function getSpriteText(myUnifont:Sprite) {
        return sprdata.readDataString(myUnifont,"stxt")
    }

    //%blockid=unifont_sprite_uniarray
    //%block="array of all unifont sprite"
    //%group="sprite mode"
    //%weight=17
    export function getSpriteArray() {
        return sprites.allOfKind(SpriteKind._unifont)
    }

    //%blockid=unifont_sprite_readsprdatainnum
    //%block="get $myUnifont from $NumType"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=16
    export function getSpriteTextData(myUnifont:Sprite,NumType:SprDataType) {
        switch (NumType) {
            case SprDataType.Tcol:
            return sprdata.readDataNumber(myUnifont,"scol");
            case SprDataType.Bcol:
            return sprdata.readDataNumber(myUnifont,"socol")
            case SprDataType.Tid:
            return sprdata.readDataNumber(myUnifont,"stid");
            case SprDataType.PageW:
            return sprdata.readDataNumber(myUnifont,"stxw");
            case SprDataType.Talg:
            return sprdata.readDataNumber(myUnifont,"salg");
            default:
            return -1;
        }
    }

    //%blockid=unifont_sprite_setalign
    //%block=" $myUnifont=variables_get set align to $alg"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=14
    export function setSpriteAlign(myUnifont:Sprite,alg:align) {
        if (sprdata.readDataNumber(myUnifont,"salg") == getAlign(alg)) { return; }
        sprdata.setDataNumber(myUnifont,"salg",getAlign(alg))
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setalignnum
    //%block=" $myUnifont set align value to $aln"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=12
    export function setSpriteAlignNum(myUnifont:Sprite,aln:number = 0) {
        if (sprdata.readDataNumber(myUnifont,"salg") == aln) { return; }
        sprdata.setDataNumber(myUnifont,"salg",aln)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setdialog
    //%block=" $myUnifont set dialog frame to $DlImg=dialog_image_picker"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=10
    export function setSpriteDialogTxt(myUnifont: Sprite,DlImg: Image) {
        if (sprdata.readDataImage(myUnifont,"sdim") && sprdata.readDataImage(myUnifont,"sdim").equals(DlImg)) { return; }
        sprdata.setDataImage(myUnifont,"sdim",DlImg)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_cleardialog
    //%block=" $myUnifont clear dialog frame"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=9
    export function clearSpriteDialog(myUnifont: Sprite) {
        if (!(sprdata.readDataImage(myUnifont,"sdim"))) { return; }
        sprdata.setDataImage(myUnifont,"sdim",undefined)
        spriteUpdate(myUnifont)
    }
    
    export enum spacetype {letterspace,lineheight}

    //%blockid=unifont_sprite_setlinespace
    //%block=" $myUnifont set $gaptype to $value"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=8
    export function setGapSpr(myUnifont: Sprite, gaptype: spacetype, value: number = 0) {
        switch (gaptype) {
        case spacetype.letterspace:
        if (sprdata.readDataNumber(myUnifont,"spacew") == value) { return; }
        sprdata.setDataNumber(myUnifont,"spacew",value)
        break;
        case spacetype.lineheight:
        if (sprdata.readDataNumber(myUnifont,"lineh") == value) { return; }
        sprdata.setDataNumber(myUnifont,"lineh",value)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setdefaultlinespace
    //%block=" $myUnifont set $gaptype to default value"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=7
    export function setDefaultGapSpr(myUnifont: Sprite, gaptype: spacetype) {
        switch (gaptype) {
        case spacetype.letterspace:
        if (sprdata.readDataNumber(myUnifont,"spacew") == undefined) { return; }
        sprdata.setDataNumber(myUnifont,"spacew",undefined)
        break;
        case spacetype.lineheight:
        if (sprdata.readDataNumber(myUnifont,"lineh") == undefined) { return; }
        sprdata.setDataNumber(myUnifont,"lineh",undefined)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_settextdata
    //%block=" $myUnifont set text to $Text"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=20
    export function setSpriteText(myUnifont: Sprite,Text: string = "") {
        if (sprdata.readDataString(myUnifont,"stxt") == Text) { return; }
        sprdata.setDataString(myUnifont,"stxt",Text)
        spriteUpdate(myUnifont)
    }

    export enum colortype {solidcolor,outlinecolor}

    //%blockid=unifont_sprite_settextcolor
    //%block=" $myUnifont set $colortexttype to $ncolor"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%ncolor.shadow=colorindexpicker
    //%group="sprite mode"
    //%weight=6
    export function setSpriteTextCol(myUnifont: Sprite,colortexttype:colortype,ncolor: number = 0) {
        switch (colortexttype) {
        case colortype.solidcolor:
        if (sprdata.readDataNumber(myUnifont,"scol") == ncolor) { return; }
        sprdata.setDataNumber(myUnifont,"scol",ncolor)
        break;
        case colortype.outlinecolor:
        if (sprdata.readDataNumber(myUnifont,"socol") == ncolor) { return; }
        sprdata.setDataNumber(myUnifont,"socol",ncolor)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_settableid
    //%block=" $myUnifont set Table id to $Tid"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=2
    export function setSpriteTableId(myUnifont: Sprite,Tid: number = 0) {
        if (sprdata.readDataNumber(myUnifont,"stid") == Tid) { return; }
        sprdata.setDataNumber(myUnifont,"stid",Tid)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setpagewidth
    //%block=" $myUnifont set page width to $PageW"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=4
    export function setSpritePageWidth(myUnifont: Sprite, PageW: number = 0) {
        if (sprdata.readDataNumber(myUnifont,"stxw") == PageW) { return; }
        sprdata.setDataNumber(myUnifont,"stxw",PageW)
        spriteUpdate(myUnifont)
    }

    export enum delaytype {delaypermsec,msec,fpsec}

    //%blockid=unifont_sprite_setpagewidth
    //%block=" $myUnifont get animation play for pause type $delaymode in (ms) $secval||and paused $pausev"
    //%secval.defl=100
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=1
    export function getSpriteAnimPlay(myUnifont: Sprite,delaymode:delaytype,secval:number,pausev:boolean=false) {
        sprdata.setDataNumber(myUnifont,"scval",0)
        if (sprdata.readDataImage(myUnifont, "sdim")) {
            sprdata.setDataImageArray(myUnifont, "imgarr", StampStrArrToDialog(sprdata.readDataImage(myUnifont, "sdim"), sprdata.readDataString(myUnifont, "stxt"), sprdata.readDataNumber(myUnifont, "stxw"), sprdata.readDataNumber(myUnifont, "stid"), sprdata.readDataNumber(myUnifont, "scol"), sprdata.readDataNumber(myUnifont, "socol"), sprdata.readDataNumber(myUnifont, "salg"), sprdata.readDataNumber(myUnifont, "spacew"), sprdata.readDataNumber(myUnifont, "lineh")))
        } else {
            sprdata.setDataImageArray(myUnifont, "imgarr", SetTextImageArray(sprdata.readDataString(myUnifont, "stxt"), sprdata.readDataNumber(myUnifont, "stxw"), sprdata.readDataNumber(myUnifont, "stid"), sprdata.readDataNumber(myUnifont, "scol"), sprdata.readDataNumber(myUnifont, "socol"), sprdata.readDataNumber(myUnifont, "salg"), false, sprdata.readDataNumber(myUnifont, "spacew"), sprdata.readDataNumber(myUnifont, "lineh")))
        }
        switch (delaymode) {
            case delaytype.delaypermsec:
            sprdata.setDataNumber(myUnifont,"scval",secval)
            break;
            case delaytype.msec:
            sprdata.setDataNumber(myUnifont,"scval",secval / sprdata.readDataImageArray(myUnifont,"imgarr").length)
            break;
            case delaytype.fpsec:
            sprdata.setDataNumber(myUnifont, "scval", 1000 / secval)
            break;
            default:
            return;
        }
        sprdata.setDataNumber(myUnifont, "sidx", 0)
        if (pausev) {
            sprdata.setDataBoolean(myUnifont, "anim", true)
            sprdata.setDataBoolean(myUnifont, "anip", false)
            for (let i = 0; i < sprdata.readDataImageArray(myUnifont, "imgarr").length; i++) {
                myUnifont.setImage(sprdata.readDataImageArray(myUnifont, "imgarr")[i])
                pause(sprdata.readDataNumber(myUnifont, "scval"))
            }
            myUnifont.setImage(sprdata.readDataImage(myUnifont, "nextimg"))
            sprdata.setDataBoolean(myUnifont, "anim", false)
            return;
        }
        if (!sprdata.readDataBoolean(myUnifont, "anim") && !(sprdata.readDataBoolean(myUnifont, "anip"))) {
            sprdata.setDataBoolean(myUnifont, "anip", true)
            sprdata.setDataBoolean(myUnifont, "anim", true)
            animation.runImageAnimation(myUnifont, sprdata.readDataImageArray(myUnifont, "imgarr"), sprdata.readDataNumber(myUnifont, "scval"), false)
        } else if (myUnifont.image.equals(sprdata.readDataImage(myUnifont, "nextimg"))) {
            sprdata.setDataBoolean(myUnifont, "anip", false)
            sprdata.setDataBoolean(myUnifont, "anim", false)
        }
    }
}

