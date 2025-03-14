namespace SpriteKind {
    export const _unifont = SpriteKind.create()
    export const _unisrc = SpriteKind.create()
}
//%block="UniFont"
//%color="#12d48a" 
//%icon="\uf031"
//%group="[UniFont]"
//%weight=10
namespace unifont {

    let rendering = false;let tablename: string[] = []; let ligs: string[][] = []; let ligages: Image[][] = []; let ligwidth: number[][] = [], ligsubw: number[][] = [], ligdir: number[][] = [], ligcol: number[][] = [], ligul: number[][] = []; let storeid: number[] = []; let letterspace: number = 1, curid: number = 0, lineheight: number = 1;

    function gettableid(name: string) {
        if (tablename.indexOf(name) < 0) {
        tablename.push(name); storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligsubw.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1;
        return tablename.length - 1
        }
        return tablename.indexOf(name)
    }

    function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
    }

    function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj))) { return true }
        return false
    }

    function deepChar(tid: number = 0, idx: number = 0, charstr: string = "", reverse: boolean = false) {
        let ustr = charstr.charAt(idx)
        let ic = 1
        let uc = charstr.charAt(idx + ic)
        let istr = "" + ustr + uc
        if (ligs[tid].indexOf(istr) < 0) { return ustr }
        while (ligs[tid].indexOf(istr) >= 0) {
            ustr = "" + ustr + uc
            if (reverse) ic--;
            else ic++;
            uc = charstr.charAt(idx + ic)
            istr = "" + ustr + uc
            if (idx + ic >= charstr.length) { break }
        }
        return ustr
    }
    
    function drawOutline(Inputi: Image, color: number, dir8: boolean) {
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

    function SetImgFrame(ImgF: Image, Wh: number, Ht: number) {
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
        for (let wi2 = 0; wi2 < Math.floor(Wh / Twidt); wi2++) {
            for (let hj2 = 0; hj2 < Math.floor(Ht / Theig); hj2++) {
                sw = Math.min(wi2 * Twidt, Wh - Twidt)
                sh = Math.min(hj2 * Theig, Ht - Theig)
                if (hj2 == 0 && wi2 == 0) {
                    drawTransparentImage(ImgTable[0], ImgOutput, sw, sh)
                } else if (hj2 == Math.floor(Ht / Theig) - 1 && wi2 == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[8], ImgOutput, sw, sh)
                } else if (hj2 == Math.floor(Ht / Theig) - 1 && wi2 == 0) {
                    drawTransparentImage(ImgTable[6], ImgOutput, sw, sh)
                } else if (hj2 == 0 && wi2 == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[2], ImgOutput, sw, sh)
                } else {
                    if (wi2 > 0 && wi2 < Math.floor(Wh / Twidt) - 1) {
                        if (hj2 == 0) {
                            drawTransparentImage(ImgTable[1], ImgOutput, sw, sh)
                        } else if (hj2 == Math.floor(Ht / Theig) - 1) {
                            drawTransparentImage(ImgTable[7], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else if (hj2 > 0 && hj2 < Math.floor(Ht / Theig) - 1) {
                        if (wi2 == 0) {
                            drawTransparentImage(ImgTable[3], ImgOutput, sw, sh)
                        } else if (wi2 == Math.floor(Wh / Twidt) - 1) {
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

    function background(then: () => void) {
        control.runInBackground(then)
    }

    function after(time: number, thenDo: () => void) {
        setTimeout(thenDo, time)
    }

    //%block="$name"
    //%blockId=unifont_tablenameshadow
    //%blockHidden=true shim=TD_ID
    //%name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //%name.fieldOptions.key="tablenameshadow"
    export function _tableNameShadow(name: string) {
        return name
    }

    /**
     * add charcter glyph to the table
     */
    //%blockid=unifont_setcharecter
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%gid.shadow=unifont_tablenameshadow gid.defl="fonttemp"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    //%weight=2
    export function setCharecter(gid: string = "fonttemp", glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, bcol: number = 0, scol: number = 0, mcol: number = 0, ncol: number = 0) {
        let tid = gettableid(gid)
        let sncol = true; let scnwidt = true; let scwidt = false; let wi3 = 0; let wj = 0; let si = 0; let imgj = image.create(imgi.width, imgi.height);
        if (bcol > 0 && bcol < 16) {
            imgi.replace(bcol, 0)
        }
        for (let xw = 0; xw < imgi.width; xw++) {
            si = 0
            for (let yh = 0; yh < imgi.height; yh++) {
                if (imgi.getPixel(xw, yh) > 0 || (scwidt && imgi.getPixel(xw + 1, yh) > 0)) { si += 1 }
            }
            if (scnwidt) {
                if (scwidt) {
                    if (si <= 0) { wj = xw; scnwidt = false; break;}
                } else {
                    if (si > 0) { wi3 = xw; scwidt = true; }
                }
            }
        }
        if (scnwidt) { wj = imgi.width; scnwidt = false; }
        imgj = image.create(Math.abs(wj - wi3), imgi.height); drawTransparentImage(imgi, imgj, 0 - wi3, 0);
        if (scol > 0 && scol < 16) {
            imgj.replace(scol, 0)
        }
        let uwid = 0
        if (inchar) {
            for (let xw2 = imgi.width - 1; xw2 >= 0; xw2--) {
                si = 0
                for (let yh2 = 0; yh2 < imgi.height; yh2++) {
                    if (imgi.getPixel(xw2, yh2) > 0) { si += 1 }
                }
                if (scnwidt) {
                    if (scwidt) {
                        if (si <= 0) { wj = xw2; scnwidt = false; break;}
                    } else {
                        if (si > 0) { wi3 = xw2; scwidt = true; }
                    }
                }
            }
            if (scnwidt) { wj = imgi.width; scnwidt = false; }
            uwid = Math.abs(wi3 - wj); if (true) {uwid = wj}
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

    export class gCprop { constructor(public chars: string, public offsets: number[]) { } }
    
    //%blockid=unifont_gcharsprop
    //%block="chars $chars offset $offsets"
    export function gCharProp(chars: string, offsets: number[]) { return new gCprop(chars, offsets) }

    export function charprops(groupc: gCprop, stayc: gCprop, cinc: gCprop, csub: gCprop): gCprop[] { return [groupc, stayc, cinc, csub]}

    export class gCarrProp { constructor(public chars: string[], public offsets: number[]) { } }


    

    //%blockid=unifont_gchararrsprop
    //%block="chars array $chars offset $offsets"
    export function gcarrprop(chars: string[], offsets: number[]) { return new gCarrProp(chars, offsets) }

    export class colorGlyphProp { constructor(public bgcolor: number, public gapcolor: number, public basecolor: number, public guardcolor: number) { } }

    //%blockid=unifont_colglyphprop
    //%block="color:| bg $bgcol gap $gapcol base $basecol guard $guardcol"
    export function colglyphprop(bgcol: number, gapcol: number, basecol: number, guardcol: number) { return new colorGlyphProp(bgcol, gapcol, basecol, guardcol) }

    /**
     * add more glyph
     * from charcter sheet
     * to the table
     */
    //%blockid=unifont_setcharfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%tid.shadow=unifont_tablenameshadow tid.defl="fonttemp"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=4
    export function setCharFromSheet(tid: string = "fonttemp", PngSheet: Image = image.create(10, 16), GroupChar: string = "", StayChar: string = "", CharOnChar: string = "", CharSubW: string = "", twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
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
    //%tid.shadow=unifont_tablenameshadow tid.defl="fonttemp"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=6
    export function setCharArrFromSheet(tid: string = "fonttemp", PngSheet: Image = image.create(10, 16), GroupChar: string[] = [], StayChar: string[] = [], CharOnChar: string[] = [], CharSubW: string[] = [], twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid2 = Math.round(PngSheet.width / twid); let uig2 = image.create(twid, thei); let txi2 = 0; let tyi2 = 0;
        for (let tvn2 = 0; tvn2 < GroupChar.length; tvn2++) {
            uig2 = image.create(twid, thei); txi2 = twid * (tvn2 % gwid2); tyi2 = thei * Math.floor(tvn2 / gwid2); drawTransparentImage(PngSheet, uig2, 0 - txi2, 0 - tyi2); setCharecter(tid, GroupChar[tvn2], uig2, StayChar.indexOf(GroupChar[tvn2]) >= 0, CharOnChar.indexOf(GroupChar[tvn2]) >= 0, CharSubW.indexOf(GroupChar[tvn2]) >= 0, bcl, scl, mcl, ncl);
        }
    }

    /**
     * read the length of
     * my charcter in table
     */
    //%blockid=unifont_numofglyphs
    //%block="number of glyphs in table id $gid"
    //%gid.shadow=unifont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=2
    export function NumOfGlyphs(gid: string = "fonttemp"): number {
        let tid2 = gettableid(gid)
        return ligs[tid2].length
    }

    /**
     * read the array charcter image
     * of my table
     */
    //%blockid=unifont_arrofgypimg
    //%block="array of glyph images in table id $gid"
    //%gid.shadow=unifont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=4
    export function ImageArray(gid: string = "fonttemp"): Image[] {
        let tid3 = gettableid(gid)
        return ligages[tid3]
    }

    /**
     * read the array charcter
     * of my table
     */
    //%blockid=unifont_arrofglyphs
    //%block="array of glyphs in table id $gid"
    //%gid.shadow=unifont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=6
    export function GlyphArray(gid: string = "fonttemp"): String[] {
        let tid4 = gettableid(gid) 
        return ligs[tid4]
    }

    function SetTextImgValue(arrm: boolean,input: string, iwidt: number, lid: string, icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false, spacew: number = undefined, lineh: number = undefined) {
        let tid5 = gettableid(lid)
        if (rendering) { if (arrm) { return [image.create(1,1)] as Image[] } else { return image.create(1,1) as Image } }
        rendering = true
        if (lineh == undefined) { lineh = lineheight}
        if (spacew == undefined) { spacew = letterspace}
        let curchar = "", curchar2 = ""; let uhei = 0; let outputarr: Image[] = []; let lnwit: number[] = []; let heig = 0; let widt = 0; let curwidt = 0; let uwidt = 0; let swidt = 0; let nwidt = 0; let wie = 0; let hie = 0; let hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            curchar = deepChar(tid5, currentletter, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))]
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter + (curchar.length - 1) >= input.length - 1)) {
                    wie += spacew
                }
                hvi = ligages[tid5][(ligs[tid5].indexOf(curchar))].height
            } else if (input.charAt(currentletter) == " ") {
                wie += 3 * spacew
            } else {
                wie += 2 * spacew
            }
            uhei = Math.max(uhei, hvi), heig = Math.max(heig, hie + hvi)
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
        wie = 0, widt = 0; let hix = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            curchar = deepChar(tid5, currentletter2, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))]
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter2 + curchar.length, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter2 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter2))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter2 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter2 + (curchar.length - 1) >= input.length - 1)) {
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
        let hgi = 0; let limg = image.create(lnwit[hgi], heig); let scwidt2 = true, underc = false, scnwidt2 = false; let rimg = image.create(8, 8), output = image.create(widt, heig); let sc = 0; hie = 0; wie = 0; curwidt = 0;
        let uoutput: Image = image.create(output.width, output.height), uuoutput: Image = image.create(output.width, output.height);
        if (bcol > 0) { uoutput = image.create(output.width+2,output.height+2) }
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            wie = 0; curchar = deepChar(tid5, currentletter3, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                hvi = ligages[tid5][(ligs[tid5].indexOf(curchar))].height; uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))];
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                scwidt2 = false; scnwidt2 = false; wie = 0; rimg = ligages[tid5][(ligs[tid5].indexOf(curchar))].clone(); let ccol = ligul[tid5][ligs[tid5].indexOf(input.charAt(currentletter3))];
                if (ligwidth[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] == 0) {
                    rimg.replace(ccol, ligcol[tid5][ligs[tid5].indexOf(curchar)])
                } else if (ligwidth[tid5][ligs[tid5].indexOf(curchar)] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] < 0) {
                    rimg.replace(ccol, 0)
                } else if (ligwidth[tid5][ligs[tid5].indexOf(curchar)] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0) {
                    rimg.replace(ccol, ligcol[tid5][ligs[tid5].indexOf(curchar)])
                }
                if (Math.abs(ligdir[tid5][ligs[tid5].indexOf(curchar)]) > 0 && Math.abs(ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.max(currentletter3 - 1, 0)))]) == 0) {
                    sc = 1; wie = 0;
                    while (sc > 0) {
                        sc = 0
                        for (let yh3 = 0; yh3 < rimg.height; yh3++) {
                            if (limg.getPixel((curwidt - letterspace) - wie, yh3) == rimg.getPixel(rimg.width - 1, yh3) && (limg.getPixel((curwidt - letterspace) - wie, yh3) != 0 && limg.getPixel((curwidt - letterspace) - wie, yh3) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                if (wie < 0) { wie = Math.abs(wie) }
                drawTransparentImage(rimg, limg, curwidt - (nwidt + wie), 0 + (hvi - ligages[tid5][(ligs[tid5].indexOf(curchar))].height))
                if (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter3 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    curwidt += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    curwidt += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter3))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter3 + (curchar.length - 1) >= input.length - 1)) {
                    curwidt += spacew
                }
            } else if (input.charAt(currentletter3) == " ") {
                curwidt += 3 * spacew
            } else {
                curwidt += 2 * spacew
            }
            uhei = Math.max(uhei, hvi)
            uuoutput = output.clone()
            if (alm < 0) {
                drawTransparentImage(limg.clone(), uuoutput, 0, hie)
            } else if (alm > 0) {
                drawTransparentImage(limg.clone(), uuoutput, Math.abs(output.width - Math.min(curwidt,limg.width)), hie)
            } else if (alm == 0) {
                drawTransparentImage(limg.clone(), uuoutput, Math.abs((output.width / 2) - (Math.min(curwidt,limg.width) / 2)), hie)
            }
            if (icol > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    uuoutput.replace(ico, icol)
                }
            }
            if (bcol > 0) {uuoutput = drawOutline(uuoutput.clone(),bcol,true) } else { uoutput = uuoutput.clone() }
            outputarr.push(uuoutput.clone())
            if (iwidt > 0) {
                if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                    if (alm < 0) {
                        drawTransparentImage(limg.clone(), output, 0, hie)
                    } else if (alm > 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    if (icol > 0) {
                        for (let ico2 = 1; ico2 < 16; ico2++) {
                            output.replace(ico2, icol)
                        }
                    }
                    if (bcol > 0) { uoutput = drawOutline(output.clone(), bcol, true) } else { uoutput = output.clone() }
                    outputarr.push(uoutput.clone())
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
            for (let ico3 = 1; ico3 < 16; ico3++) {
                output.replace(ico3, icol)
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
    //%tid.shadow=unifont_tablenameshadow tid.defl="fonttemp"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function SetTextImage(input: string = "", iwidt: number = 0, tid: string = "fonttemp", icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false,spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(false, input, iwidt, tid, icol, bcol, alm, debugalm, spacew, lineh) as Image
    }

    /**
     * render text from my table
     * like basic text animation
     * to image array
     */
    //%blockid=unifont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm and get debugalm $debugalm"
    //%tid.shadow=unifont_tablenameshadow tid.defl="fonttemp"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function SetTextImageArray(input: string = "", iwidt: number = 0, tid: string = "fonttemp", icol: number = 0, bcol: number = 0, alm: number = 0, debugalm: boolean = false, spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(true, input, iwidt, tid, icol, bcol, alm, debugalm, spacew, lineh) as Image[]
    }

    /** 
     * render text
     * and stamp to 
     * my dialog frame
     */
    //%blockid=unifont_stamptexttoframe
    //%block="StampStrImgToTheDialogFrame $Fimg=dialog_image_picker Text $Txt Text width $Wval TableId $arrid||And text color col $ucol and outline $bcol Alignment $ualm"
    //%arrid.shadow=unifont_tablenameshadow arrid.defl="fonttemp"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function StampStrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: string = "fonttemp", ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
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
    //%arrid.shadow=unifont_tablenameshadow arrid.defl="fonttemp"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function StampStrArrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: string = "fonttemp", ucol: number = 0, bcol: number = 0, ualm: number = 0,spacew: number = 0, lineh: number = 0) {
        let StrImg2: Image[] = SetTextImageArray(Txt, Wval, arrid, ucol, bcol, ualm, false, spacew, lineh)
        let gapw2 = Math.floor(Fimg.width / 3)
        let gaph2 = Math.floor(Fimg.height / 3)
        let UfImg2: Image = SetImgFrame(Fimg, StrImg2[0].width + ((gapw2 * 2) + Math.floor(gapw2 / 2)), StrImg2[0].height + ((gaph2 * 2) + Math.floor(gaph2 / 2)))
        let imgArr: Image[] = []
        let uimg: Image = null
        for (let mgi = 0; mgi < StrImg2.length; mgi++) {
            uimg = UfImg2.clone()
            drawTransparentImage(StrImg2[mgi].clone(), uimg, gapw2, gaph2)
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

    export enum align { left = -1, center = 0, right = 1}

    /**
     * get alignment value
     */
    //%blockid=unifont_getalignmentval
    //%block="get $alg of alignment"
    //%group="modify"
    export function getAlign(alg: align) {
        return alg
    }

    export enum tempfont { MainFont = 1, ArcadeFont = 2, LatinMini = 3}

    /**
     * set charcter
     * from template
     */
    //%blockid=unifont_presetfont
    //%block="SetupPresetFont $tempf with table id $tid"
    //%tid.shadow=unifont_tablenameshadow tid.defl="fonttemp"
    //%group="create"
    //%weight=10
    export function SetupPresetFont(tempf: tempfont, tid: string = "fonttemp") {
        switch (tempf) {
            case 1:
                _mainfont(tid)
                break;
            case 2:
                _arcadefont(tid)
                break;
            case 3:
                _latinmini(tid)
                break;
            default:
                _mainfont(tid)
                break;
        }
    }

    function spriteUpdate(Spr: Sprite ) {
        if (!(Spr)) { return; }
        if (sprdata.readDataImage(Spr,"sdim")) {
            sprdata.setDataImage(Spr, "nextimg", StampStrToDialog(sprdata.readDataImage(Spr, "sdim"), sprdata.readDataString(Spr, "stxt"), sprdata.readDataNumber(Spr,"stxw"),sprdata.readDataString(Spr,"stid"),sprdata.readDataNumber(Spr,"scol"),sprdata.readDataNumber(Spr,"socol"),sprdata.readDataNumber(Spr,"salg"),sprdata.readDataNumber(Spr,"spacew"),sprdata.readDataNumber(Spr,"lineh")))
        } else {
            sprdata.setDataImage(Spr, "nextimg", SetTextImage(sprdata.readDataString(Spr, "stxt"),sprdata.readDataNumber(Spr,"stxw"),sprdata.readDataString(Spr,"stid"),sprdata.readDataNumber(Spr,"scol"),sprdata.readDataNumber(Spr,"socol"),sprdata.readDataNumber(Spr,"salg"),false,sprdata.readDataNumber(Spr,"spacew"),sprdata.readDataNumber(Spr,"lineh")))
        }
        if (Spr.image.equals(sprdata.readDataImage(Spr,"nextimg"))) { return; }
        Spr.setImage(sprdata.readDataImage(Spr,"nextimg"))
    }

    export enum SprDataNumType {Tcol=1,Bcol=2,PageW=3,Talg=4}

    /**
     * create the unifont as sprite
     */
    //%blockid=unifont_sprite_create
    //%block="create unifont sprite as $Text in color $Col with outline $Bcol in alignment $alg and tableid $Tid||and page width $PageW"
    //%Tid.shadow=unifont_tablenameshadow Tid.defl="fonttemp"
    //%Col.shadow=colorindexpicker
    //%Bcol.shadow=colorindexpicker
    //%blockSetVariable="myUnifont"
    //%group="sprite mode"
    //%weight=22
    export function newUnifontSprite(Text: string = "", Col: number, Bcol: number, alg: align, Tid: string = "fonttemp", PageW: number = 0) {
        let _UnifontSprite = sprites.create(img`
            .
        `, SpriteKind._unifont)
        sprdata.setDataString(_UnifontSprite,"stxt",Text)
        sprdata.setDataNumber(_UnifontSprite,"scol",Col)
        sprdata.setDataString(_UnifontSprite,"stid",Tid)
        sprdata.setDataNumber(_UnifontSprite,"stxw",PageW)
        sprdata.setDataNumber(_UnifontSprite,"salg",getAlign(alg))
        sprdata.setDataNumber(_UnifontSprite,"spacew",undefined)
        sprdata.setDataNumber(_UnifontSprite,"lineh",undefined)
        sprdata.setDataNumber(_UnifontSprite,"socol",Bcol)
        spriteUpdate(_UnifontSprite)
        _UnifontSprite.setPosition(Math.floor(scene.screenWidth() / 2), Math.floor(scene.screenHeight() / 2))
        return _UnifontSprite
    }
    
    /**
     * get text data
     * from unifont sprite
     */
    //%blockid=unifont_sprite_readtxt
    //%block="get $myUnifont as text data"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=18
    export function getSpriteText(myUnifont:Sprite) {
        return sprdata.readDataString(myUnifont,"stxt")
    }

    /**
     * get unifont sprite
     * in sprite array
     */
    //%blockid=unifont_sprite_uniarray
    //%block="array of all unifont sprite"
    //%group="sprite mode"
    //%weight=17
    export function getSpriteArray() {
        return sprites.allOfKind(SpriteKind._unifont)
    }

    /**
     * get option data number
     * from unifont sprite
     */
    //%blockid=unifont_sprite_readsprdatainnum
    //%block="get $myUnifont from $NumType"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=16
    export function getSpriteTextData(myUnifont:Sprite,NumType:SprDataNumType) {
        switch (NumType) {
            case 1:
            return sprdata.readDataNumber(myUnifont,"scol");
            case 2:
            return sprdata.readDataNumber(myUnifont,"socol")
            case 3:
            return sprdata.readDataNumber(myUnifont,"stxw");
            case 4:
            return sprdata.readDataNumber(myUnifont,"salg");
            default:
            return -1;
        }
    }

    /**
     * set alignment as enum
     * to unifont sprite
     */
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

    /**
     * set alignment as number
     * to unifont sprite
     */
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

    /**
     * add or set dialog frame
     * to unifont sprite
     */
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

    /**
     * remove dialog frame
     * at unifont sprite
     */
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
    
    export enum spacetype {letterspace=1,lineheight=2}

    /**
     * set gap space 
     * to unifont sprite
     */
    //%blockid=unifont_sprite_setlinespace
    //%block=" $myUnifont set $gaptype to $value"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=8
    export function setGapSpr(myUnifont: Sprite, gaptype: spacetype, value: number = 0) {
        switch (gaptype) {
        case 1:
        if (sprdata.readDataNumber(myUnifont,"spacew") == value) { return; }
        sprdata.setDataNumber(myUnifont,"spacew",value)
        break;
        case 2:
        if (sprdata.readDataNumber(myUnifont,"lineh") == value) { return; }
        sprdata.setDataNumber(myUnifont,"lineh",value)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    /**
     * clear gap space
     * at unifont sprite
     */
    //%blockid=unifont_sprite_setdefaultlinespace
    //%block=" $myUnifont set $gaptype to default value"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=7
    export function setDefaultGapSpr(myUnifont: Sprite, gaptype: spacetype) {
        switch (gaptype) {
        case 1:
        if (sprdata.readDataNumber(myUnifont,"spacew") == undefined) { return; }
        sprdata.setDataNumber(myUnifont,"spacew",undefined)
        break;
        case 2:
        if (sprdata.readDataNumber(myUnifont,"lineh") == undefined) { return; }
        sprdata.setDataNumber(myUnifont,"lineh",undefined)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    /**
     * set text to render
     * to unifont sprite
     */
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

    export enum colortype {solidcolor=1,outlinecolor=2}

    /**
     * set text color index
     * to unifont sprite
     */
    //%blockid=unifont_sprite_settextcolor
    //%block=" $myUnifont set $colortexttype to $ncolor"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%ncolor.shadow=colorindexpicker
    //%group="sprite mode"
    //%weight=6
    export function setSpriteTextCol(myUnifont: Sprite,colortexttype:colortype,ncolor: number = 0) {
        switch (colortexttype) {
        case 1:
        if (sprdata.readDataNumber(myUnifont,"scol") == ncolor) { return; }
        sprdata.setDataNumber(myUnifont,"scol",ncolor)
        break;
        case 2:
        if (sprdata.readDataNumber(myUnifont,"socol") == ncolor) { return; }
        sprdata.setDataNumber(myUnifont,"socol",ncolor)
        break;
        default:
        return;
        }
        spriteUpdate(myUnifont)
    }

    /**
     * set table id 
     * to unifont sprite
     */
    //%blockid=unifont_sprite_settableid
    //%block=" $myUnifont set Table id to $Tid"
    //%Tid.shadow=unifont_tablenameshadow Tid.defl="fonttemp"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=3
    export function setSpriteTableId(myUnifont: Sprite,Tid: string = "fonttemp") {
        if (sprdata.readDataString(myUnifont,"stid") == Tid) { return; }
        sprdata.setDataString(myUnifont,"stid",Tid)
        spriteUpdate(myUnifont)
    }

    /**
     * set page width
     * to unifont sprite
     */
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

    export enum delaytype {delaypermsec=1,multisec=2}

    /**
     * play text animation
     * from unifont sprite
     */
    //%blockid=unifont_sprite_playanimatiom
    //%block=" $myUnifont get animation play for pause type $delaymode in (ms) $secval||and separeted $pausev"
    //%secval.defl=100
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=2
    export function getSpriteAnimPlay(myUnifont: Sprite,delaymode:delaytype,secval:number,pausev:boolean=false) {
        if (sprdata.readDataBoolean(myUnifont, "anim")) return;
        sprdata.setDataNumber(myUnifont,"scval",0)
        let umsec = 0; let lensec = 0;
        if (sprdata.readDataImage(myUnifont, "sdim")) {
            sprdata.setDataImageArray(myUnifont, "imgarr", StampStrArrToDialog(sprdata.readDataImage(myUnifont, "sdim"), sprdata.readDataString(myUnifont, "stxt"), sprdata.readDataNumber(myUnifont, "stxw"), sprdata.readDataString(myUnifont, "stid"), sprdata.readDataNumber(myUnifont, "scol"), sprdata.readDataNumber(myUnifont, "socol"), sprdata.readDataNumber(myUnifont, "salg"), sprdata.readDataNumber(myUnifont, "spacew"), sprdata.readDataNumber(myUnifont, "lineh")))
        } else {
            sprdata.setDataImageArray(myUnifont, "imgarr", SetTextImageArray(sprdata.readDataString(myUnifont, "stxt"), sprdata.readDataNumber(myUnifont, "stxw"), sprdata.readDataString(myUnifont, "stid"), sprdata.readDataNumber(myUnifont, "scol"), sprdata.readDataNumber(myUnifont, "socol"), sprdata.readDataNumber(myUnifont, "salg"), false, sprdata.readDataNumber(myUnifont, "spacew"), sprdata.readDataNumber(myUnifont, "lineh")))
        }
        switch (delaymode) {
            case 1:
                sprdata.setDataNumber(myUnifont,"scval",secval)
                umsec = secval
                lensec = secval * sprdata.readDataImageArray(myUnifont, "imgarr").length
            break;
            case 2:
                sprdata.setDataNumber(myUnifont,"scval",secval / sprdata.readDataImageArray(myUnifont,"imgarr").length)
                umsec = secval
                lensec = secval
            break;
            default:
            return;
        }
        sprdata.setDataNumber(myUnifont, "sidx", 0)
        if (pausev) {
            sprdata.setDataBoolean(myUnifont, "anim", true)
            sprdata.setDataBoolean(myUnifont, "anip", false)
            background( function() {
                for (let i = 0; i < sprdata.readDataImageArray(myUnifont, "imgarr").length; i++) {
                    myUnifont.setImage(sprdata.readDataImageArray(myUnifont, "imgarr")[i])
                    pause(sprdata.readDataNumber(myUnifont, "scval"))
                }
            })
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
        after( lensec, function () {
            sprdata.setDataBoolean(myUnifont, "anip", false)
            sprdata.setDataBoolean(myUnifont, "anim", false)
            myUnifont.setImage(sprdata.readDataImage(myUnifont, "nextimg"))
        })
    }

    /**
     * check unifont sprite
     * playing animation until done
     */
    //%blockid=unifont_sprite_playanimisdone
    //%block=" $myUnifont get animation is stop"
    //%myUnifont.shadow=variables_get myUnifont.defl=myUnifont
    //%group="sprite mode"
    //%weight=1
    export function animdone(myUnifont: Sprite) {
        return !(sprdata.readDataBoolean(myUnifont, "anim"))
    }
}
