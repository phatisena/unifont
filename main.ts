namespace SpriteKind {
    export const Unifont = SpriteKind.create()
    export const Unisrc = SpriteKind.create()
}
//%block="UniFont"
//%color="#12d48a" 
//%icon="\uf031"
//%weight=3
namespace unifont {

    export let ligs: string[][] = []; export let ligages: Image[][] = []; export let ligwidth: number[][] = []; export let ligsubw: number[][] = []; export let ligdir: number[][] = []; export let ligcol: number[][] = []; export let ligul: number[][] = []; export let storeid: number[] = []; export let letterspace: number = 1; export let curid = 0; export let lineheight = 1;

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
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker ||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
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
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar ||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
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
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with array of letters $GroupChar ||and | array of staying letters $StayChar array of letters on the letters $CharOnChar and array of Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
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

    export function SetTextImgValue(arrm: boolean,input: string, iwidt: number, tid: number, icol: number = 0, alm: number = 0, debugalm: boolean = false) {
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
                    wie += letterspace
                }
                hvi = ligages[tid][(ligs[tid].indexOf(curchar))].height
            } else if (input.charAt(currentletter) == " ") {
                wie += 3 * letterspace
            } else {
                wie += 2 * letterspace
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
                    hie += lineheight
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
                    wie += letterspace
                }
            } else if (input.charAt(currentletter2) == " ") {
                wie += 3 * letterspace
            } else {
                wie += 2 * letterspace
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
                    curwidt += letterspace
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * letterspace
            } else {
                curwidt += 2 * letterspace
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
            outputarr.push(output.clone())
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
                    hie += lineheight
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
        outputarr.push(output.clone())
        if (arrm) { return outputarr as Image[] }
        return output as Image
    }
    
    /**
     * render text from my table
     * to the image
     */
    //%blockid=unifont_setimgfromtext
    //%block="create the image of |text $input in page width $iwidt from table id $tid ||and |fill col $icol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function SetTextImage(input: string, iwidt: number, tid: number, icol: number = 0, alm: number = 0, debugalm: boolean = false) {
        return SetTextImgValue(false, input, iwidt, tid, icol, alm, debugalm) as Image
    }

    /**
     * render text from my table
     * like basic text animation
     * to image array
     */
    //%blockid=unifont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid ||and |fill col $icol and got alignment $alm and get debugalm $debugalm"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function SetTextImageArray(input: string, iwidt: number, tid: number, icol: number = 0, alm: number = 0, debugalm: boolean = false) {
        return SetTextImgValue(true, input, iwidt, tid, icol, alm, debugalm) as Image[]
    }

    /** 
     * render text
     * and stamp to 
     * my dialog frame
     */
    //%blockid=unifont_stamptexttoframe
    //%block="StampStrImgToTheDialogFrame $Fimg=dialog_image_picker Text $Txt Text width $Wval TableId $arrid || Solid col $ucol Alignment $ualm"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function StampStrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, ualm: number = 0) {
        let StrImg: Image = SetTextImage(Txt, Wval, arrid, ucol, ualm)
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
    //%block="StampStrAnimToDialogFrame $Fimg=dialog_image_picker Text input $Txt In text width $Wval At table id $arrid ||With text color $ucol And alignment $ualm "
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function StampStrArrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number = 0, ucol: number = 0, ualm: number = 0) {
        let StrImg: Image[] = SetTextImageArray(Txt, Wval, arrid, ucol, ualm)
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
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111f111f1111111111111111111111111
                        111111111111111111f1f11111111111111f11111111111111111111111f111111111f111f11111111f1f11111111111111111111111111
                        11111111111f111111f1f11111f1f1111fffff11fff111f111f11111111f111111111f111f1111111fffff1111111111111111111111111
                        fff1f1f1111f11111111111111f1f111f11f11f1f1f11f111f1f1111111111111111f11111f1111111f1f111111f1111111111111111111
                        1f11fff1111f1111111111111fffff11f11f1111ff11f1111f1f1111111111111111f11111f111111f111f11111f1111111111111111111
                        1f11f1f1111f11111111111111f1f1111fffff11111f111111f11111111111111111f11111f11111111111111fffff11111111111fffff1
                        1f11f1f1111f1111111111111fffff11111f11f111f11ff11f1f1f11111111111111f11111f1111111111111111f1111111111111111111
                        11111111111111111111111111f1f111f11f11f11f11f1f11f11f111111111111111f11111f1111111111111111f1111111f11111111111
                        11111111111f11111111111111f1f1111fffff11f111fff111ff1f111111111111111f111f1111111111111111111111111f11111111111
                        11111111111111111111111111111111111f111111111111111111111111111111111f111f111111111111111111111111f111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111f1111fff111111f111111fff11111fff1111111f1111fffff1111fff1111fffff1111fff11111fff111111111111111111
                        111111111111f1111f111f1111ff11111f111f111f111f11111ff1111f1111111f111f1111111f111f111f111f111f11111111111111111
                        111111111111f1111ff11f11111f111111111f1111111f1111f1f1111f1111111f1111111111f1111f111f111f111f11111f1111111f111
                        11111111111f11111f1f1f11111f11111111f111111ff1111f11f1111ffff1111ffff1111111f11111fff11111ffff11111f1111111f111
                        1111111111f111111f11ff11111f1111111f111111111f111fffff1111111f111f111f11111f11111f111f1111111f11111111111111111
                        111f111111f111111f111f11111f111111f111111f111f111111f1111f111f111f111f11111f11111f111f111f111f11111f1111111f111
                        111f11111f11111111fff11111fff1111fffff1111fff1111111f11111fff11111fff11111f1111111fff11111fff111111f1111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111fff11111ffff1111fff1111ffff11111fff1111ffff1111fffff111fffff1111fff1111f111f1111fff11
                        1111ff11111111111ff111111f111f111f1111f11f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
                        11ff11111fffff11111ff11111111f11f11ff1f11f111f111f111f111f1111111f111f111f1111111f1111111f1111111f111f11111f111
                        1f1111111111111111111f111111f111f1f1f1f11fffff111ffff1111f1111111f111f111fff11111fff11111f11ff111fffff11111f111
                        11ff11111fffff11111ff111111f1111f11fff111f111f111f111f111f1111111f111f111f1111111f1111111f111f111f111f11111f111
                        1111ff11111111111ff11111111111111f1111111f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
                        111111111111111111111111111f111111fffff11f111f111ffff11111fff1111ffff1111fffff111f11111111fff1111f111f1111fff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111f111f111f1111111f111f111f111f1111fff1111ffff11111fff1111ffff11111fff1111fffff111f111f111f111f111f111f1
                        11111f111f11f1111f1111111ff1ff111ff11f111f111f111f111f111f111f111f111f111f111f11111f11111f111f111f111f111f1f1f1
                        11111f111f1f11111f1111111f1f1f111f1f1f111f111f111f111f111f111f111f111f111f111111111f11111f111f111f111f111f1f1f1
                        11111f111ff111111f1111111f111f111f11ff111f111f111ffff1111f111f111ffff11111fff111111f11111f111f1111f1f1111f1f1f1
                        1f111f111f1f11111f1111111f111f111f111f111f111f111f1111111f1f1f111f111f1111111f11111f11111f111f1111f1f11111f1f11
                        1f111f111f11f1111f1111111f111f111f111f111f111f111f1111111f11f1111f111f111f111f11111f11111f111f1111f1f11111f1f11
                        11fff1111f111f111fffff111f111f111f111f1111fff1111f11111111ff1f111f111f1111fff111111f111111fff111111f111111f1f11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111fff111111111fff11111111f11111111111111f11111111111111111111111111111111111111111111
                        1111111111111111111111111111f1111111111111f1111111f1f11111111111111f1111111111111111111111111111111111111111111
                        1f111f111f111f111fffff111111f1111f11111111f111111f111f111111111111111111111111111f1111111111111111111f111111111
                        11f1f1111f111f1111111f111111f11111f1111111f11111111111111111111111111111111111111f1111111111111111111f111111111
                        11f1f11111f1f1111111f1111111f11111f1111111f111111111111111111111111111111ffff1111f1ff11111fff11111ff1f1111fff11
                        111f111111f1f111111f11111111f111111f111111f1111111111111111111111111111111111f111ff11f111f111f111f11ff111f111f1
                        11f1f111111f111111f111111111f1111111f11111f1111111111111111111111111111111ffff111f111f111f1111111f111f111fffff1
                        11f1f111111f11111f1111111111f1111111f11111f111111111111111111111111111111f111f111f111f111f111f111f111f111f11111
                        1f111f11111f11111fffff111111f11111111f1111f1111111111111111111111111111111ffff111ffff11111fff11111ffff1111ffff1
                        1111111111111111111111111111f1111111111111f11111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111fff111111111fff11111111111111fffff1111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111ff11111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
                        111f1111111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
                        11fff11111ff1f111f1ff11111111111111111111f11f11111f111111ff1f1111f1ff11111fff1111f1ff11111ffff111f1ff11111ffff1
                        111f11111f11ff111ff11f11111f1111111f11111f1f111111f111111f1f1f111ff11f111f111f111ff11f111f111f111ff11f111f11111
                        111f11111f111f111f111f11111f1111111f11111ff1111111f111111f1f1f111f111f111f111f111f111f111f111f111f11111111fff11
                        111f111111ffff111f111f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ffff11111ffff111f11111111111f1
                        111f111111111f111f111f11111f1111111f11111f11f111111f11111f1f1f111f111f1111fff1111f11111111111f111f1111111ffff11
                        111111111ffff111111111111111111111f1111111111111111111111111111111111111111111111f11111111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111ff1111f11111ff111111111111111f1f111111111111111111
                        111111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111fff111111111111111111
                        11f111111111111111111111111111111111111111111111111111111111f111111f1111111f111111111111111111111fffff111fffff1
                        11f111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111111111f11111f1f11111f
                        1ffff1111f111f111f111f111f111f111f111f111f111f111fffff111111f111111f1111111f1111111ff1f111111111f1fff1f1f1fff1f
                        11f111111f111f111f111f111f1f1f1111f1f1111f111f111111f11111ff1111111f11111111ff1111f1ff1111111111f1f111f1f1ff11f
                        11f111111f111f1111f1f1111f1f1f11111f111111f1f111111f11111111f111111f1111111f11111111111111111111f1fff1f1f1f1f1f
                        11f111111f111f1111f1f11111f1f11111f1f11111f1f11111f111111111f111111f1111111f11111111111111111111f11111f1f11111f
                        111ff11111ffff11111f111111f1f1111f111f11111f11111fffff111111f111111f1111111f111111111111111111111fffff111fffff1
                        111111111111111111111111111111111111111111f11111111111111111f111111f1111111f11111111111111111111111111111111111
                        11111111111111111111111111111111111111111f1111111111111111111ff1111f11111ff111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "™!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°©®",
                    "",
                    "",
                    "",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11fff1111ff11f111f1f1f1111fff11111f1f1111f1f11f11111ff1111fff1111fff11111ff11f111f1f1f111ff11f111ff11f1111fff11
                        1f111f111f1f1f111fff1f111f111f111f1f1f111fff11f111111f111f111f11f111f1111f1f1f111fff1f11f11f1f11f11f1f111f111f1
                        11f11f11111f1f11111f1f111f111f111f111f11111f11f11f111f1111111f111111f111111ff111111ff1111f1f1f111f1f1f1111f11f1
                        1f111f1111f11f1111f11f111fff1f111fff1f11111f11f111f11f1111ff1f11ff11f11111f11f1111f11f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f11111f11f1111f1f11111f1f111f11f1111f111f111f111f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f1111fff1f11111ff11111f1f111f1fff111f111f111f111f11f1ffff11ff1f1f111ff11f1
                        1f111f1111fff11111fff1111f111f111f111f1111ff1ff111111f111111ff111ff1ff1111fff11111fff111f1ff1f11ff1fff111ff11f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113113111fffff1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113331111fff1f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11fff11111fff111f1f1ff11f11f1f111ff11f1111fff11111f1f11111fff111ff1ff11111ffff11ff11f111ff111f11ff111f111ff11f1
                        1f111f111fff1111ffff11f1ffff1f11f11f1f111f111f111f1f1f111f111f111ff11f111f1111111f11f1111f111f111f111f111f111f1
                        11f11f111111f11111f111f1f11f1f111f1f1f111f111f111f111f1111f11f111f111f1111ffff111f11f1111f111f111f111f111f111f1
                        11f11f111ff1f11111f111f1f11f1f11f11f1f111fff1f111fff1f111f111f111f111f1111111f111f11f1111f111f111f111f111f111f1
                        11f11f1111f1f11111f111f1f11f1f11f11f1f111f1f1f111f1f1f111f111f111f111f1111f11f111f11f1111f111f111f111f111f1f1f1
                        1ff11f1111f1f11111f111f1f1ffff11ff1ffff11f1f1f111f1f1f111ff11f111f111f1111f11f111f1fff111f111f111f111f111ff1ff1
                        1ff11f1111ff111111f111f1f1ff1f11ff1f1ff11ff11f111ff11f111ff11f111f111f1111ffff111ff1ff111fffff111fffff111f111f1
                        11111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff1ff111331311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1f1f1f111313311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111f111111111111111f111111111111111f1
                        1ff11f11ff111f11ff111f1111fff111ff11f111ff11f11111ff111111fff11111fff11111fff111ff111f1111fff111ff11ff11ff11ff1
                        1f111f111f111f111f111f111f111f111f11f111f111f1111f11f1111f111f111f111f111f1f1f111f111f111f1f1f111f11f1111f111f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f111f111f11111f1111111111f1111111f111f111f111f1f1f1111111f111f1f1f111f1f1f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f1111ff1f111111f111111ff1f1111111f111fff1f111f1ffff111ff1f111ff11f111f1f1f1
                        1f1f1f111ff1ff111ff1ff1111f11f111f11f111f111f111111f11111f11ff1111111f111f111f111f111f111f11ff111f111f111ff1ff1
                        1ff1ff111ff1ff111ff1ff111ff11f11fff1f111f111f111111f11111f111f111111ff111f111f111f111f111f111f111f111f111ff1ff1
                        1f111f111f111f111f111f111ff11f11ff1ff111fffff11111ff11111ff11f111111ff111f111f111fffff111ff11f111f111f111f111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111fff11111ff11111f11f111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111f1111111f11f1111f1ff1111111111111111111111111111111111111111f1
                        11111111111111111111111111111111111111111111111111f111111f11f11111f1f1111111111111111111111111111f111f111ffff11
                        111111111111111111111111111111111111111111111111111f111111f1f1111111f1111111111111111111111111111ffff1111ff1ff1
                        1111111111111f1111111111111111111111111111111111111f11111111f1111111f111111111111111111111111111111111111111111
                        11fff1111ffff1111111111111fff1111111f1111f11f111111f11111111f1111111f11111fff11111fff11111fff111111111111111111
                        1f111f111fff1f111ff11f111f111f111111f1111f11f111111f11111111f1111111f1111f111f111f111f111f111f11111111111111111
                        11111f1111111f1111fff11111111f111111f1111f11f111111f11111111f1111111f11111f11f1111f11f1111111f11111111111111111
                        1ff11f111ff11f111111111111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f111ff11f1111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f1111fff11111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        1fffff111fffff111111111111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111ff111111f111111ff11111fff1f11111f1111111111111111111
                        11ff11111111111111111f111111ff11111f1f111111111111111111111f1111111f1111111ff1111f1ff11111fff111ff1111111111111
                        11ff11111fffff111fffff111fffff111fffff11111111111111111111111111111111111111111111111111111f1111ff1111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff11ffff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        111111111111111111111111111111111111111111ff111111f1f1111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111f1111111ff1111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111f11111f1f1111f111111111111f111111f1111111f111111111111111111111111111111111
                        1ffff1111ffff1111f1f1f111ff1f1111fff11111fff111111f111111f1f11f111fff1111111f1111111111111111111111111111111111
                        f1111f11f1111f111f1fff11f11f1f11f1111111f1111111111ff111f1f1f1f11f1111111fff11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1111111f111111111111f11f1f1f1f1f1111111f11f11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1ff1111f1ff11111ff11f11f1f1f1f1f111f111f111f1111111111111111111111111111111111
                        f1111f11f11f1f111f111f11f11f1f11f1f11111f1f111111f111f11f1f1f1f1f1f1f111ff11f1111111111111111111111111111111111
                        1ffff1111ff11f111fffff11ff1f1f111ffff1111ffff11111fff111f1f1ff111f1ff111ff111f111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาเแโใไฤฦๅั็ํิีึืุู์่้๊๋ำ฿๐๑๒๓๔๕๖๗๘๙",
                    "ั็ํิีึืุู์่้๊๋",
                    "ั็ํิีึื์่้๊๋",
                    "ำ",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharArrFromSheet(
                    tid,
                    img`
    111f1111111ff111111ff1111111f1111111f111111ff111111ff1111111f111111f111111ff111111ff1111111f1111111f1111111ff11
    111f11111111ff11111f1f11111fff111111f1111111ff11111f1f11111fff11111f1111111ff11111f1f11111fff111111f11111111ff1
    1111111111111111111111111111f1111111111111111111111111111111f1111111f11111111f1111111f11111f1f11111111111111111
    1f111f111f111f111f111f111f111f11111ff111111ff111111ff111111ff111ffff11111ffff1111ffff1111ffff111111111111111111
    1ffff1111ffff1111ffff1111ffff111111ff111111ff111111ff111111ff111ff1ff1111ff1ff111ff1ff111ff1ff11fffff1111fffff1
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111ff111111f1111111f111111ff111111ff1111111f11111111f111111ff111111ff111111f1111111f111111ff111111ff1111111f111
    111f1f1111fff111111f1111111ff11111f1f11111fff1111111f1111111ff11111f1f1111fff111111f1111111ff11111f1f11111fff11
    11111111111f1111111111111111111111111111111f1111111111111111111111111111111f1111111111111111111111111111111f111
    11111111111111111111f1111111f1111111f1111111f1111111ff111111ff111111ff111111ff1111f1f11111f1f11111f1f11111f1f11
    1fffff11fffff111fffff111fffff111fffff111fffff1111fffff111fffff111fffff111fffff11fffff111fffff111fffff111fffff11
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    11f11111ff111111ff1111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    11f111111ff11111f1f11111fff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    1111111111111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    1ff111111ff111111ff111111ff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    1ff111111ff111111ff111111ff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    11111ff111111ff111111ff111111ff11fff1ff11fff1ff1111111111111111111111111111111111111111111111111111111111111111
    1111f11f1111f11f1111f11f1111f11ff111f11ff111f11f111111111111111111111111111111111111111111111111111111111111111
    1111111f1111111f1111111f1111111f1f11f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
    1111111f1111111f1111111f1111111ff111f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
    1111111f1111111f1111111f1111111ff111f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
    1111111f1111111f1111111f1111111fff11f11fff11f11f111111111111111111111111111111111111111111111111111111111111111
    1111111f1111111f1111111f1111111fff11f11fff11f11f111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    `,
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋",
                        "่ำ",
                        "้ำ",
                        "๊ำ",
                        "๋ำ",
                        "ฤๅ",
                        "ฦๅ"
                    ],
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋"
                    ],
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋"
                    ],
                    [
                        "่ำ",
                        "้ำ",
                        "๊ำ",
                        "๋ำ"
                    ],
                    8,
                    16,
                    1,
                    0,
                    0,
                    0
                )
                break;
            case tempfont.ArcadeFont:
                setCharFromSheet(
                    tid,
                    img`
            111111111f1f11111f1f111111f11111ff11f111111111111f1111111f111111f1111111f111f1111111111111111111111111111111111
            1f1111111f1f11111f1f11111ffff111ff1f1111ff1111111f111111f11111111f1111111f1f11111111111111111111111111111111111
            1f11111111111111fffff111f1f11111111f1111f1f1111111111111f11111111f111111fffff11111f1111111111111111111111111111
            1f111111111111111f1f11111fff111111f111111f11111111111111f11111111f1111111f1f111111f1111111111111111111111111111
            1f11111111111111fffff11111f1f1111f111111f1f1f11111111111f11111111f111111f111f111fffff11111111111fffff1111111111
            11111111111111111f1f1111ffff11111f1ff111f11f111111111111f11111111f1111111111111111f11111ff11111111111111ff11111
            1f111111111111111f1f111111f11111f11ff1111ff1f111111111111f111111f11111111111111111f111111f11111111111111ff11111
            1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111111111111111111111
            1111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111f11111ff111111f1111111ff111111ff11111111f1111ffff11111ff11111ffff11111ff111111ff1111111111111111111111111111
            111f1111f11f1111ff111111f11f1111f11f111111ff1111f1111111f11f1111111f1111f11f1111f11f1111ff111111ff111111111ff11
            11f11111f1ff11111f111111111f111111f111111f1f1111fff11111fff11111111f11111ff11111f11f1111ff111111ff1111111ff1111
            1f111111ff1f11111f11111111f11111111f1111f11f1111111f1111f11f111111f11111f11f11111fff11111111111111111111f111111
            1f111111f11f11111f1111111f111111f11f1111fffff111f11f1111f11f11111f111111f11f1111f11f1111ff111111ff1111111ff1111
            f11111111ff11111fff11111ffff11111ff11111111f11111ff111111ff111111f1111111ff111111ff11111ff1111111f111111111ff11
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            11111111111111111fff11111fff11111ff11111fff111111ff11111fff11111ffff1111ffff11111ff11111f11f1111fff11111111f111
            11111111ff111111f111f111f111f111f11f1111f11f1111f11f1111f11f1111f1111111f1111111f11f1111f11f11111f111111111f111
            fffff11111ff1111111f1111f1f1f111f11f1111fff11111f1111111f11f1111fff11111fff11111f1111111ffff11111f111111111f111
            111111111111f11111f11111f1ff1111ffff1111f11f1111f1111111f11f1111f1111111f1111111f1ff1111f11f11111f111111111f111
            fffff11111ff111111111111f1111111f11f1111f11f1111f11f1111f11f1111f1111111f1111111f11f1111f11f11111f111111f11f111
            11111111ff11111111f111111ffff111f11f1111fff111111ff11111fff11111ffff1111f11111111ff11111f11f1111fff111111ff1111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            f11f1111f1111111f111f111f11f11111ff11111fff111111ff11111fff111111ff11111fffff111f11f1111f111f111f111f111f111f11
            f1f11111f1111111ff1ff111ff1f1111f11f1111f11f1111f11f1111f11f1111f11f111111f11111f11f1111f111f111f1f1f1111f1f111
            ff111111f1111111f1f1f111f1ff1111f11f1111f11f1111f11f1111f11f11111f11111111f11111f11f1111f111f111f1f1f11111f1111
            ff111111f1111111f1f1f111f11f1111f11f1111fff11111ff1f1111fff1111111f1111111f11111f11f11111f1f1111f1f1f11111f1111
            f1f11111f1111111f111f111f11f1111f11f1111f1111111f1f11111f11f1111f11f111111f11111f11f11111f1f11111f1f11111f1f111
            f11f1111ffff1111f111f111f11f11111ff11111f11111111f1f1111f11f11111ff1111111f111111ff1111111f111111f1f1111f111f11
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            1111111111111111ff111111f1111111ff111111111111111f111111f111111111111111111111111111111111111111111111111111111
            f111f111ffff1111f11111111f1111111f11111111111111f1f111111f11111111111111f111111111111111111f11111111111111f1111
            f111f111111f1111f11111111f1111111f11111111111111f1f111111111111111111111f111111111111111111f1111111111111f1f111
            1f1f111111f11111f111111111f111111f1111111111111111111111111111111fff1111fff111111fff11111fff11111ff111111f11111
            11f111111f111111f1111111111f11111f111111111111111111111111111111f11f1111f11f1111f1111111f11f1111f1ff1111fff1111
            11f11111f1111111f1111111111f11111f111111111111111111111111111111f11f1111f11f1111f1111111f11f1111ff1111111f11111
            11f11111ffff1111ff1111111111f111ff111111fffff11111111111111111111fff1111fff111111fff11111fff11111fff11111f11111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            11111111111111111f11111111f11111f1111111ff111111111111111111111111111111111111111111111111111111111111111f11111
            1fff1111111111111111111111111111f11111111f111111111111111111111111111111fff111111fff111111111111111111111f11111
            f11f1111fff11111ff1111111ff11111f1f111111f111111ff1f1111fff111111ff11111f11f1111f11f1111f1f111111fff1111fff1111
            f11f1111f11f11111f11111111f11111ff1111111f111111f1f1f111f11f1111f11f1111f11f1111f11f1111ff1f1111ff1111111f11111
            1fff1111f11f11111f111111f1f11111f1f111111f111111f1f1f111f11f1111f11f1111fff111111fff1111f111111111ff11111f1f111
            f11f1111f11f1111fff111111f111111f11f1111fff11111f1f1f111f11f11111ff11111f1111111111f1111f1111111fff1111111f1111
            1ff111111111111111111111111111111111111111111111111111111111111111111111f1111111111f111111111111111111111111111
            1111111111111111111111111111111111111111111111111ff11111f1111111ff111111111111111111111111111111111111111111111
            1111111111111111111111111111111111111111111111111f111111f11111111f111111111111111111111111111111111111111111111
            11111111111111111111111111111111f11f1111111111111f111111f11111111f111111111111111111111111111111111111111111111
            f11f1111f111f111f111f111f11f1111f11f1111ffff1111ff111111f11111111ff111111ff1f1111111111111111111111111111111111
            f11f1111f111f111f1f1f1111ff11111f11f111111f111111f111111f11111111f111111f1ff11111111111111111111111111111111111
            f11f11111f1f1111f1f1f1111ff111111fff11111f1111111f111111f11111111f111111111111111111111111111111111111111111111
            1fff111111f111111f1f1111f11f1111f11f1111ffff11111ff11111f1111111ff111111111111111111111111111111111111111111111
            111111111111111111111111111111111ff1111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
            111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
        `,
                    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
                    "",
                    "",
                    "",
                    8,
                    8,
                    1,
                    0,
                    0,
                    0
                )
                break;
            default:
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111f111f1111111111111111111111111
                        111111111111111111f1f11111111111111f11111111111111111111111f111111111f111f11111111f1f11111111111111111111111111
                        11111111111f111111f1f11111f1f1111fffff11fff111f111f11111111f111111111f111f1111111fffff1111111111111111111111111
                        fff1f1f1111f11111111111111f1f111f11f11f1f1f11f111f1f1111111111111111f11111f1111111f1f111111f1111111111111111111
                        1f11fff1111f1111111111111fffff11f11f1111ff11f1111f1f1111111111111111f11111f111111f111f11111f1111111111111111111
                        1f11f1f1111f11111111111111f1f1111fffff11111f111111f11111111111111111f11111f11111111111111fffff11111111111fffff1
                        1f11f1f1111f1111111111111fffff11111f11f111f11ff11f1f1f11111111111111f11111f1111111111111111f1111111111111111111
                        11111111111111111111111111f1f111f11f11f11f11f1f11f11f111111111111111f11111f1111111111111111f1111111f11111111111
                        11111111111f11111111111111f1f1111fffff11f111fff111ff1f111111111111111f111f1111111111111111111111111f11111111111
                        11111111111111111111111111111111111f111111111111111111111111111111111f111f111111111111111111111111f111111111111
                        1111111111111111111111111111111111111111111111111111111111111111111111f1f11111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111f1111fff111111f111111fff11111fff1111111f1111fffff1111fff1111fffff1111fff11111fff111111111111111111
                        111111111111f1111f111f1111ff11111f111f111f111f11111ff1111f1111111f111f1111111f111f111f111f111f11111111111111111
                        111111111111f1111ff11f11111f111111111f1111111f1111f1f1111f1111111f1111111111f1111f111f111f111f11111f1111111f111
                        11111111111f11111f1f1f11111f11111111f111111ff1111f11f1111ffff1111ffff1111111f11111fff11111ffff11111f1111111f111
                        1111111111f111111f11ff11111f1111111f111111111f111fffff1111111f111f111f11111f11111f111f1111111f11111111111111111
                        111f111111f111111f111f11111f111111f111111f111f111111f1111f111f111f111f11111f11111f111f111f111f11111f1111111f111
                        111f11111f11111111fff11111fff1111fffff1111fff1111111f11111fff11111fff11111f1111111fff11111fff111111f1111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111fff11111ffff1111fff1111ffff11111fff1111ffff1111fffff111fffff1111fff1111f111f1111fff11
                        1111ff11111111111ff111111f111f111f1111f11f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
                        11ff11111fffff11111ff11111111f11f11ff1f11f111f111f111f111f1111111f111f111f1111111f1111111f1111111f111f11111f111
                        1f1111111111111111111f111111f111f1f1f1f11fffff111ffff1111f1111111f111f111fff11111fff11111f11ff111fffff11111f111
                        11ff11111fffff11111ff111111f1111f11fff111f111f111f111f111f1111111f111f111f1111111f1111111f111f111f111f11111f111
                        1111ff11111111111ff11111111111111f1111111f111f111f111f111f111f111f111f111f1111111f1111111f111f111f111f11111f111
                        111111111111111111111111111f111111fffff11f111f111ffff11111fff1111ffff1111fffff111f11111111fff1111f111f1111fff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111f111f111f1111111f111f111f111f1111fff1111ffff11111fff1111ffff11111fff1111fffff111f111f111f111f111f111f1
                        11111f111f11f1111f1111111ff1ff111ff11f111f111f111f111f111f111f111f111f111f111f11111f11111f111f111f111f111f1f1f1
                        11111f111f1f11111f1111111f1f1f111f1f1f111f111f111f111f111f111f111f111f111f111111111f11111f111f111f111f111f1f1f1
                        11111f111ff111111f1111111f111f111f11ff111f111f111ffff1111f111f111ffff11111fff111111f11111f111f1111f1f1111f1f1f1
                        1f111f111f1f11111f1111111f111f111f111f111f111f111f1111111f1f1f111f111f1111111f11111f11111f111f1111f1f11111f1f11
                        1f111f111f11f1111f1111111f111f111f111f111f111f111f1111111f11f1111f111f111f111f11111f11111f111f1111f1f11111f1f11
                        11fff1111f111f111fffff111f111f111f111f1111fff1111f11111111ff1f111f111f1111fff111111f111111fff111111f111111f1f11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111fff111111111fff11111111f11111111111111f11111111111111111111111111111111111111111111
                        1111111111111111111111111111f1111111111111f1111111f1f11111111111111f1111111111111111111111111111111111111111111
                        1f111f111f111f111fffff111111f1111f11111111f111111f111f111111111111111111111111111f1111111111111111111f111111111
                        11f1f1111f111f1111111f111111f11111f1111111f11111111111111111111111111111111111111f1111111111111111111f111111111
                        11f1f11111f1f1111111f1111111f11111f1111111f111111111111111111111111111111ffff1111f1ff11111fff11111ff1f1111fff11
                        111f111111f1f111111f11111111f111111f111111f1111111111111111111111111111111111f111ff11f111f111f111f11ff111f111f1
                        11f1f111111f111111f111111111f1111111f11111f1111111111111111111111111111111ffff111f111f111f1111111f111f111fffff1
                        11f1f111111f11111f1111111111f1111111f11111f111111111111111111111111111111f111f111f111f111f111f111f111f111f11111
                        1f111f11111f11111fffff111111f11111111f1111f1111111111111111111111111111111ffff111ffff11111fff11111ffff1111ffff1
                        1111111111111111111111111111f1111111111111f11111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111fff111111111fff11111111111111fffff1111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111ff11111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
                        111f1111111111111f111111111f1111111f11111f11111111f111111111111111111111111111111111111111111111111111111111111
                        11fff11111ff1f111f1ff11111111111111111111f11f11111f111111ff1f1111f1ff11111fff1111f1ff11111ffff111f1ff11111ffff1
                        111f11111f11ff111ff11f11111f1111111f11111f1f111111f111111f1f1f111ff11f111f111f111ff11f111f111f111ff11f111f11111
                        111f11111f111f111f111f11111f1111111f11111ff1111111f111111f1f1f111f111f111f111f111f111f111f111f111f11111111fff11
                        111f111111ffff111f111f11111f1111111f11111f1f111111f111111f1f1f111f111f111f111f111ffff11111ffff111f11111111111f1
                        111f111111111f111f111f11111f1111111f11111f11f111111f11111f1f1f111f111f1111fff1111f11111111111f111f1111111ffff11
                        111111111ffff111111111111111111111f1111111111111111111111111111111111111111111111f11111111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111f11111111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff111111111111111111
                        1111111111111111111111111111111111111111111111111111111111111ff1111f11111ff111111111111111f1f111111111111111111
                        111111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111fff111111111111111111
                        11f111111111111111111111111111111111111111111111111111111111f111111f1111111f111111111111111111111fffff111fffff1
                        11f111111111111111111111111111111111111111111111111111111111f111111f1111111f11111111111111111111f11111f1f11111f
                        1ffff1111f111f111f111f111f111f111f111f111f111f111fffff111111f111111f1111111f1111111ff1f111111111f1fff1f1f1fff1f
                        11f111111f111f111f111f111f1f1f1111f1f1111f111f111111f11111ff1111111f11111111ff1111f1ff1111111111f1f111f1f1ff11f
                        11f111111f111f1111f1f1111f1f1f11111f111111f1f111111f11111111f111111f1111111f11111111111111111111f1fff1f1f1f1f1f
                        11f111111f111f1111f1f11111f1f11111f1f11111f1f11111f111111111f111111f1111111f11111111111111111111f11111f1f11111f
                        111ff11111ffff11111f111111f1f1111f111f11111f11111fffff111111f111111f1111111f111111111111111111111fffff111fffff1
                        111111111111111111111111111111111111111111f11111111111111111f111111f1111111f11111111111111111111111111111111111
                        11111111111111111111111111111111111111111f1111111111111111111ff1111f11111ff111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "™!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°©®",
                    "",
                    "",
                    "",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharFromSheet(
                    tid,
                    img`
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11fff1111ff11f111f1f1f1111fff11111f1f1111f1f11f11111ff1111fff1111fff11111ff11f111f1f1f111ff11f111ff11f1111fff11
                        1f111f111f1f1f111fff1f111f111f111f1f1f111fff11f111111f111f111f11f111f1111f1f1f111fff1f11f11f1f11f11f1f111f111f1
                        11f11f11111f1f11111f1f111f111f111f111f11111f11f11f111f1111111f111111f111111ff111111ff1111f1f1f111f1f1f1111f11f1
                        1f111f1111f11f1111f11f111fff1f111fff1f11111f11f111f11f1111ff1f11ff11f11111f11f1111f11f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f11111f11f1111f1f11111f1f111f11f1111f111f111f111f11f11f1f11f11f1f1111f11f1
                        1f111f111f111f111f111f111f111f111f111f1111fff1f11111ff11111f1f111f1fff111f111f111f111f11f1ffff11ff1f1f111ff11f1
                        1f111f1111fff11111fff1111f111f111f111f1111ff1ff111111f111111ff111ff1ff1111fff11111fff111f1ff1f11ff1fff111ff11f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113113111fffff1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111113331111fff1f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111111111
                        11fff11111fff111f1f1ff11f11f1f111ff11f1111fff11111f1f11111fff111ff1ff11111ffff11ff11f111ff111f11ff111f111ff11f1
                        1f111f111fff1111ffff11f1ffff1f11f11f1f111f111f111f1f1f111f111f111ff11f111f1111111f11f1111f111f111f111f111f111f1
                        11f11f111111f11111f111f1f11f1f111f1f1f111f111f111f111f1111f11f111f111f1111ffff111f11f1111f111f111f111f111f111f1
                        11f11f111ff1f11111f111f1f11f1f11f11f1f111fff1f111fff1f111f111f111f111f1111111f111f11f1111f111f111f111f111f111f1
                        11f11f1111f1f11111f111f1f11f1f11f11f1f111f1f1f111f1f1f111f111f111f111f1111f11f111f11f1111f111f111f111f111f1f1f1
                        1ff11f1111f1f11111f111f1f1ffff11ff1ffff11f1f1f111f1f1f111ff11f111f111f1111f11f111f1fff111f111f111f111f111ff1ff1
                        1ff11f1111ff111111f111f1f1ff1f11ff1f1ff11ff11f111ff11f111ff11f111f111f1111ffff111ff1ff111fffff111fffff111f111f1
                        11111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff1ff111331311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1f1f1f111313311111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f
                        11111f111111111111111f1111111111111111111111111111111111111111111111111111111f111111111111111f111111111111111f1
                        1ff11f11ff111f11ff111f1111fff111ff11f111ff11f11111ff111111fff11111fff11111fff111ff111f1111fff111ff11ff11ff11ff1
                        1f111f111f111f111f111f111f111f111f11f111f111f1111f11f1111f111f111f111f111f1f1f111f111f111f1f1f111f11f1111f111f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f111f111f11111f1111111111f1111111f111f111f111f1f1f1111111f111f1f1f111f1f1f1
                        1f111f111f1f1f111f1f1f1111f11f111f11f1111ff1f111111f111111ff1f1111111f111fff1f111f1ffff111ff1f111ff11f111f1f1f1
                        1f1f1f111ff1ff111ff1ff1111f11f111f11f111f111f111111f11111f11ff1111111f111f111f111f111f111f11ff111f111f111ff1ff1
                        1ff1ff111ff1ff111ff1ff111ff11f11fff1f111f111f111111f11111f111f111111ff111f111f111f111f111f111f111f111f111ff1ff1
                        1f111f111f111f111f111f111ff11f11ff1ff111fffff11111ff11111ff11f111111ff111f111f111fffff111ff11f111f111f111f111f1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111fff11111ff11111f11f111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111111111f1111111f11f1111f1ff1111111111111111111111111111111111111111f1
                        11111111111111111111111111111111111111111111111111f111111f11f11111f1f1111111111111111111111111111f111f111ffff11
                        111111111111111111111111111111111111111111111111111f111111f1f1111111f1111111111111111111111111111ffff1111ff1ff1
                        1111111111111f1111111111111111111111111111111111111f11111111f1111111f111111111111111111111111111111111111111111
                        11fff1111ffff1111111111111fff1111111f1111f11f111111f11111111f1111111f11111fff11111fff11111fff111111111111111111
                        1f111f111fff1f111ff11f111f111f111111f1111f11f111111f11111111f1111111f1111f111f111f111f111f111f11111111111111111
                        11111f1111111f1111fff11111111f111111f1111f11f111111f11111111f1111111f11111f11f1111f11f1111111f11111111111111111
                        1ff11f111ff11f111111111111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f111ff11f1111111f111111f1111f11f111111f11111111f1111111f1111f111f1111f11f1111111f11111111111111111
                        1f111f111f111f1111fff11111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        1fffff111fffff111111111111111f111111ff111ff1ff11111ff1111111ff111111ff111ff11f111ff11f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111f1111111f1111111f11111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111111111111111111111111ff111111f111111ff11111fff1f11111f1111111111111111111
                        11ff11111111111111111f111111ff11111f1f111111111111111111111f1111111f1111111ff1111f1ff11111fff111ff1111111111111
                        11ff11111fffff111fffff111fffff111fffff11111111111111111111111111111111111111111111111111111f1111ff1111111111111
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111fff11ffff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1f1f1f1
                        1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f1ffff11
                        11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111f111
                        111111111111111111111111111111111111111111ff111111f1f1111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111111111111111111111f1111111ff1111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111111111111111f111111111111111111f11111f1f1111f111111111111f111111f1111111f111111111111111111111111111111111
                        1ffff1111ffff1111f1f1f111ff1f1111fff11111fff111111f111111f1f11f111fff1111111f1111111111111111111111111111111111
                        f1111f11f1111f111f1fff11f11f1f11f1111111f1111111111ff111f1f1f1f11f1111111fff11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1111111f111111111111f11f1f1f1f1f1111111f11f11111111111111111111111111111111111
                        f1111f11f1ff1f111f111f11f11f1f11f1ff1111f1ff11111ff11f11f1f1f1f1f111f111f111f1111111111111111111111111111111111
                        f1111f11f11f1f111f111f11f11f1f11f1f11111f1f111111f111f11f1f1f1f1f1f1f111ff11f1111111111111111111111111111111111
                        1ffff1111ff11f111fffff11ff1f1f111ffff1111ffff11111fff111f1f1ff111f1ff111ff111f111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาเแโใไฤฦๅั็ํิีึืุู์่้๊๋ำ฿๐๑๒๓๔๕๖๗๘๙",
                    "ั็ํิีึืุู์่้๊๋",
                    "ั็ํิีึื์่้๊๋",
                    "ำ",
                    8,
                    16,
                    1,
                    0,
                    15,
                    3
                )
                setCharArrFromSheet(
                    tid,
                    img`
                        111f1111111ff111111ff1111111f1111111f111111ff111111ff1111111f111111f111111ff111111ff1111111f1111111f1111111ff11
                        111f11111111ff11111f1f11111fff111111f1111111ff11111f1f11111fff11111f1111111ff11111f1f11111fff111111f11111111ff1
                        1111111111111111111111111111f1111111111111111111111111111111f1111111f11111111f1111111f11111f1f11111111111111111
                        1f111f111f111f111f111f111f111f11111ff111111ff111111ff111111ff111ffff11111ffff1111ffff1111ffff111111111111111111
                        1ffff1111ffff1111ffff1111ffff111111ff111111ff111111ff111111ff111ff1ff1111ff1ff111ff1ff111ff1ff11fffff1111fffff1
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111ff111111f1111111f111111ff111111ff1111111f11111111f111111ff111111ff111111f1111111f111111ff111111ff1111111f111
                        111f1f1111fff111111f1111111ff11111f1f11111fff1111111f1111111ff11111f1f1111fff111111f1111111ff11111f1f11111fff11
                        11111111111f1111111111111111111111111111111f1111111111111111111111111111111f1111111111111111111111111111111f111
                        11111111111111111111f1111111f1111111f1111111f1111111ff111111ff111111ff111111ff1111f1f11111f1f11111f1f11111f1f11
                        1fffff11fffff111fffff111fffff111fffff111fffff1111fffff111fffff111fffff111fffff11fffff111fffff111fffff111fffff11
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11f11111ff111111ff1111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11f111111ff11111f1f11111fff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1111111111111111111111111f1111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff111111ff111111ff111111ff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        1ff111111ff111111ff111111ff111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        11111ff111111ff111111ff111111ff11fff1ff11fff1ff1111111111111111111111111111111111111111111111111111111111111111
                        1111f11f1111f11f1111f11f1111f11ff111f11ff111f11f111111111111111111111111111111111111111111111111111111111111111
                        1111111f1111111f1111111f1111111f1f11f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
                        1111111f1111111f1111111f1111111ff111f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
                        1111111f1111111f1111111f1111111ff111f11f1f11f11f111111111111111111111111111111111111111111111111111111111111111
                        1111111f1111111f1111111f1111111fff11f11fff11f11f111111111111111111111111111111111111111111111111111111111111111
                        1111111f1111111f1111111f1111111fff11f11fff11f11f111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111f11f1111f11f111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    `,
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋",
                        "่ำ",
                        "้ำ",
                        "๊ำ",
                        "๋ำ",
                        "ฤๅ",
                        "ฦๅ"
                    ],
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋"
                    ],
                    [
                        "ั่",
                        "ั้",
                        "ั๊",
                        "ั๋",
                        "ํ่",
                        "ํ้",
                        "ํ๊",
                        "ํ๋",
                        "็่",
                        "็้",
                        "็๊",
                        "็๋",
                        "ิ่",
                        "ิ้",
                        "ิ๊",
                        "ิ๋",
                        "ี่",
                        "ี้",
                        "ี๊",
                        "ี๋",
                        "ึ่",
                        "ึ้",
                        "ึ๊",
                        "ึ๋",
                        "ื่",
                        "ื้",
                        "ื๊",
                        "ื๋"
                    ],
                    [
                        "่ำ",
                        "้ำ",
                        "๊ำ",
                        "๋ำ"
                    ],
                    8,
                    16,
                    1,
                    0,
                    0,
                    0
                )
                break;
        }
    }

    //% blockId=spriteDataSetNumber block="set $sprite=variables_get data $name to number $value"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataNumber(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    //% blockId=spriteDataChangeNumber block="change $sprite=variables_get data $name by number $value"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function changeDataNumberBy(sprite: Sprite, name: string, value: number) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = (d[name] || 0) + value;
    }

    //% blockId=spriteDataGetNumber block="$sprite=variables_get data $name as number"
    //% blockHidden=true
    //% name.shadow="spriteDataNumberNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataNumber(sprite: Sprite, name: string): number {
        if (!sprite || !name) return 0;
        const d = sprite.data;
        return d[name] as number;
    }

    //% blockId=spriteDataSetString block="set $sprite=variables_get data $name to string $value"
    //% blockHidden=true
    //% name.shadow="spriteDataStringNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function setDataString(sprite: Sprite, name: string, value: string) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    //% blockId=spriteDataGetString block="$sprite=variables_get data $name as string"
    //% blockHidden=true
    //% name.shadow="spriteDataStringNameShadow"
    //% group="Data"
    //% weight=10
    //% blockGap=8
    export function readDataString(sprite: Sprite, name: string): string {
        if (!sprite || !name) return "";
        const d = sprite.data;
        return d[name] as string;
    }

    //% block="$name"
    //% blockId=spriteDataNumberNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatanumber"
    export function _numberNameShadow(name: string) {
        return name
    }

    //% block="$name"
    //% blockId=spriteDataStringNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedatastring"
    export function _stringNameShadow(name: string) {
        return name
    }

    //% blockId=spriteDataSetImage block="set $sprite=variables_get data $name to image $value"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% deprecated=1
    //% weight=9
    //% blockGap=8
    export function setDataImage(sprite: Sprite, name: string, value: Image) {
        setDataImageValue(sprite, name, value);
    }

    //% blockId=spriteDataSetImageValue block="set $sprite data $name to image $value"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% sprite.shadow=variables_get
    //% value.shadow=screen_image_picker
    //% weight=9
    //% blockGap=8
    export function setDataImageValue(sprite: Sprite, name: string, value: Image) {
        if (!sprite || !name) return;
        const d = sprite.data;
        d[name] = value;
    }

    //% blockId=spriteDataGetImage block="$sprite=variables_get data $name as image"
    //% blockHidden=true
    //% name.shadow="spriteDataImageNameShadow"
    //% group="Data"
    //% weight=9
    //% blockGap=8
    export function readDataImage(sprite: Sprite, name: string): Image {
        if (!sprite || !name) return undefined;
        const d = sprite.data;
        return d[name] as Image;
    }

    //% block="$name"
    //% blockId=spriteDataImageNameShadow
    //% blockHidden=true shim=TD_ID
    //% name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //% name.fieldOptions.key="spritedataimage"
    export function _imageNameShadow(name: string) {
        return name
    }

    export function spriteUpdate(Spr: Sprite ) {
        if (!(Spr)) { return; }
        if (readDataImage(Spr,"sdim")) {
            setDataImage(Spr,"nextimg",StampStrToDialog(readDataImage(Spr,"sdim"),readDataString(Spr,"stxt"),readDataNumber(Spr,"stxw"),readDataNumber(Spr,"stid"),readDataNumber(Spr,"scol"),readDataNumber(Spr,"salg")))
        } else {
            setDataImage(Spr,"nextimg",SetTextImage(readDataString(Spr,"stxt"),readDataNumber(Spr,"stxw"),readDataNumber(Spr,"stid"),readDataNumber(Spr,"scol"),readDataNumber(Spr,"salg")))
        }
        if (Spr.image.equals(readDataImage(Spr,"nextimg"))) { return; }
        Spr.setImage(readDataImage(Spr,"nextimg"))
    }

    export enum SprDataType {Tcol,Tid,PageW,Talg}

    //%blockid=unifont_sprite_create
    //%block="create unifont sprite as $Text in color $Col in alignment $alg ||and tableid $Tid"
    //%Col.shadow=colorindexpicker
    //%blockSetVariable="myUnifont"
    //%group="sprite mode"
    //%weight=22
    export function newUnifontSprite(Text: string = "",Col: number ,alg: align, Tid: number = 0) {
        let _UnifontSprite = sprites.create(img`
            .
        `, SpriteKind.Unifont)
        setDataString(_UnifontSprite,"stxt",Text)
        setDataNumber(_UnifontSprite,"scol",Col)
        setDataNumber(_UnifontSprite,"stid",Tid)
        setDataNumber(_UnifontSprite,"stxw",0)
        setDataNumber(_UnifontSprite,"salg",getAlign(alg))
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
        return readDataString(myUnifont,"stxt")
    }

    //%blockid=unifont_sprite_readsprdatainnum
    //%block="get $myUnifont from $NumType"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=16
    export function getSpriteTextData(myUnifont:Sprite,NumType:SprDataType) {
        switch (NumType) {
            case SprDataType.Tcol:
            return readDataNumber(myUnifont,"scol");
            case SprDataType.Tid:
            return readDataNumber(myUnifont,"stid");
            case SprDataType.PageW:
            return readDataNumber(myUnifont,"stxw");
            case SprDataType.Talg:
            return readDataNumber(myUnifont,"salg");
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
        setDataNumber(myUnifont,"salg",getAlign(alg))
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setalignnum
    //%block=" $myUnifont set align value to $aln"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=12
    export function setSpriteAlignNum(myUnifont:Sprite,aln:number = 0) {
        setDataNumber(myUnifont,"salg",aln)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setdialog
    //%block=" $myUnifont set dialog frame to $DlImg=dialog_image_picker"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=10
    export function setSpriteDialogTxt(myUnifont: Sprite,DlImg: Image) {
        setDataImage(myUnifont,"sdim",DlImg)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_cleardialog
    //%block=" $myUnifont clear dialog frame"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=8
    export function clearSpriteDialog(myUnifont: Sprite) {
        setDataImage(myUnifont,"sdim",undefined)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_settextdata
    //%block=" $myUnifont set text to $Text"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=20
    export function setSpriteText(myUnifont: Sprite,Text: string = "") {
        setDataString(myUnifont,"stxt",Text)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_settextcolor
    //%block=" $myUnifont set text color to $Col"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%Col.shadow=colorindexpicker
    //%group="sprite mode"
    //%weight=6
    export function setSpriteTextCol(myUnifont: Sprite,Col: number = 0) {
        setDataNumber(myUnifont,"scol",Col)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_settableid
    //%block=" $myUnifont set Table id to $Tid"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=2
    export function setSpriteTableId(myUnifont: Sprite,Tid: number = 0) {
        setDataNumber(myUnifont,"stid",Tid)
        spriteUpdate(myUnifont)
    }

    //%blockid=unifont_sprite_setpagewidth
    //%block=" $myUnifont set page width to $PageW"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=4
    export function setSpritePageWidth(myUnifont: Sprite, PageW: number = 0) {
        setDataNumber(myUnifont,"stxw",PageW)
        spriteUpdate(myUnifont)
    }
}
