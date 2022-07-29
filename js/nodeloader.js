
const initData = {
    nodes: [],
    links: []
};

const elem = document.getElementById("3d-graph");

const Graph = ForceGraph3D({ controlType: 'orbit' })
    (document.getElementById('3d-graph'))
    .nodeLabel('id')
    .backgroundColor(hexToRgbA('#E4E4E4', 1));

function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

const storyNodes = [];
const themeNodes = [];

const orderedLinks = [];
const firstStageLinks = [];
const secondStageLinks = [];
const combinedStageLinks = [];

$.getJSON("data/Data - Stories.json", function (gData_json) {
    //console.log(gData_json);

    for (var i in gData_json) {
        storyNodes.push(gData_json[i])
    }
    LoadThemes()
    FillSearchDrop()
})
function LoadThemes() {
    $.getJSON("data/Data - Themes.json", function (gData_json) {
        //console.log(gData_json);

        for (var i in gData_json) {
            themeNodes.push(gData_json[i])
        }

        LoadOrdered()
    })
}
function LoadOrdered() {
    $.getJSON("data/Data - Ordered.json", function (gData_json) {
        for (var i in gData_json) {
            orderedLinks.push(gData_json[i])
        }
        LoadFirstStage()
    })
}
function LoadFirstStage() {
    $.getJSON("data/Data - Coding_First_Stage.json", function (gData_json) {
        for (var i in gData_json) {
            firstStageLinks.push(gData_json[i])
        }
        LoadSecondStage()
    })
}
function LoadSecondStage() {
    $.getJSON("data/Data - Coding_Second_Stage.json", function (gData_json) {
        for (var i in gData_json) {
            secondStageLinks.push(gData_json[i])
        }
        LoadCombinedStage()
    })
}
function LoadCombinedStage() {
    $.getJSON("data/Data - Coding_Combined.json", function (gData_json) {
        for (var i in gData_json) {
            combinedStageLinks.push(gData_json[i])
        }

        stageMode = 3;
        restagingMode()
    })
}

var stageMode = 0;
var includeOrdered = false;

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "1":
            stageMode = 1;
            restagingMode()
            // code for "down arrow" key press.
            break;
        case "2":
            stageMode = 2;
            restagingMode()
            // code for "up arrow" key press.
            break;
        case "3":
            stageMode = 3;
            restagingMode()
            // code for "left arrow" key press.
            break;
        case "4":
            includeOrdered = !includeOrdered;
            restagingMode()
            // code for "right arrow" key press.
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window


function restagingMode() {
    console.log(stageMode)
    switch (stageMode) {
        case 0:
            console.log("oh")
            break;
        case 1: MakeGraph(firstStageLinks, includeOrdered)
            break;
        case 2: MakeGraph(secondStageLinks, includeOrdered)
            break;
        case 3: MakeGraph(combinedStageLinks, includeOrdered)
            break;
    }
}

function MakeGraph(setLinks) {

    var { nodes, links } = Graph.graphData();

    if (nodes.length == 0) {
        console.log("nodes not found")
        nodes = storyNodes.concat(themeNodes)
    }

    if (includeOrdered) {
        setLinks = setLinks.concat(orderedLinks)
    }

    var nLinks = []
    for (var i in setLinks) {
        nLinks.push(
            {
                source: nodes.filter(node => node.id === setLinks[i].source)[0],
                target: nodes.filter(node => node.id === setLinks[i].target)[0]
            });
    }

    const gData = {
        nodes: nodes,
        links: nLinks
    };

    Graph.graphData(gData)
    SetStyle()
}


const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;

function NodeColor(node, opacity) {
    switch (node.id) {
        case 'History': return '' + hexToRgbA('#25408F', opacity); break;
        case 'Reflective Places': return '' + hexToRgbA('#7DCDC4', opacity); break;
        case 'Education': return '' + hexToRgbA('#EF9330', opacity); break;
        case 'Gentrification': return '' + hexToRgbA('#00AEEF', opacity); break;
        case 'Social Spaces': return '' + hexToRgbA('#CC60A3', opacity); break;
        case 'Life and Memories': return '' + hexToRgbA('#DDCA3E', opacity); break;
        case 'Gender': return '' + hexToRgbA('#D3333F', opacity); break;
        case 'Transport': return '' + hexToRgbA('#884199', opacity); break;
        case 'Nature': return '' + hexToRgbA('#8ACC3E', opacity); break;
        default:
            return 'rgba(0,0,0,1)'
    }
}
function NodeColorHEX(node) {
    switch (node.id) {
        case 'History': return '' + '#25408F'; break;
        case 'Reflective Places': return '' + '#7DCDC4'; break;
        case 'Education': return '' + '#EF9330'; break;
        case 'Gentrification': return '' + '#00AEEF'; break;
        case 'Social Spaces': return '' + '#CC60A3'; break;
        case 'Life and Memories': return '' + '#DDCA3E'; break;
        case 'Gender': return '' + '#D3333F'; break;
        case 'Transport': return '' + '#884199'; break;
        case 'Nature': return '' + '#8ACC3E'; break;
        default:
            return '#000000'
    }
}
function LinkAlpha(node) {
    var value = 0.4;
    switch (node.id) {
        case 'History':
        case 'Reflective Places':
        case 'Education':
        case 'Gentrification':
        case 'Social Spaces':
        case 'Life and Memories':
        case 'Gender':
        case 'Transport':
        case 'Nature': value = 1; break;
        default:
            value = 0.4; break;
    }
    return value;
}
function SetStyle() {
    const { nodes, links } = Graph.graphData();

    const gData = {
        nodes: nodes,
        links: links
    };

    for (var i in gData.nodes) {
        gData.nodes[i].neighbors = []
        gData.nodes[i].links = []
    }

    for (var i in gData.links) {
        //console.log(gData.links[i].source.id)

        const a = gData.nodes.filter(node => node.id === gData.links[i].source.id)[0];
        const b = gData.nodes.filter(node => node.id === gData.links[i].target.id)[0];
        //console.log(a)
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(gData.links[i]);
        b.links.push(gData.links[i]);
    }

    Graph.graphData(gData)
        .nodeColor(node => highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,255,255,1)' : NodeColor(node, 0.8) : node.group === 1 ? 'rgba(0,255,255,1)' : NodeColor(node, 1))
        .linkWidth(link => highlightLinks.has(link) ? 3 : 1)
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 4 : 0)
        .linkDirectionalParticleWidth(2)
        .linkOpacity(0.7)
        .linkColor(link => NodeColor(link.source, 1))
        .onNodeHover(node => {
            // no state change
            if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

            highlightNodes.clear();
            highlightLinks.clear();
            if (node) {
                highlightNodes.add(node);
                node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
                node.links.forEach(link => highlightLinks.add(link));
            }

            hoverNode = node || null;

            updateHighlight();
        })
        .onLinkHover(link => {
            highlightNodes.clear();
            highlightLinks.clear();

            if (link) {
                highlightLinks.add(link);
                highlightNodes.add(link.source);
                highlightNodes.add(link.target);
            }

            updateHighlight();
        }).onNodeClick(node => {
            // Aim at node from outside it
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            Graph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );

            ClearDraw();

            if (node['group'] == 1) {
                $(".themeImage")[0].style.display = 'none'
                $(".storyImage").attr("src", `StoryImages/` + node['participant'] + `_` + node['order'] + `.JPG`);
                $(".storyTitle").text("Story " + node['id']);
                $(".storyImage")[0].style.display = 'block'
                $(".js-modal-trigger")[0].style.display = 'block'
            } else {
                $(".storyImage")[0].style.display = 'none'
                $(".js-modal-trigger")[0].style.display = 'none'
                var shape
                switch (stageMode) {
                    case 1: shape = "triangle"; break;
                    case 2: shape = "square"; break;
                    case 3: shape = "circle"; break;
                    default: shape = ""; break;
                }
                var filledState = "filled"
                var fileName = node['id'].split(' ').join('_')
                $(".themeImage").attr("src", `images/` + shape + `_` + filledState + `_` + fileName + `.png`);
                $(".themeImage")[0].style.display = 'block';
                $(".storyTitle").text("Theme ");
            }
            $(".nodeTitle")[0].style.backgroundColor = NodeColorHEX(node);
            $(".storySubtitle").text(node['title']);
            $(".storyText").html(node['text']);

            $('.drawer').drawer('open');
            setTimeout(function () {
                $('.drawer').drawer()[0].iScroll.refresh();
                $('.drawer').drawer()[0].iScroll.scrollTo(0, 0);
            }, 300);

        }).nodeThreeObject(node => {

            if (node['group'] == 1) {
                var sprite
                const imgTexture = new THREE.TextureLoader().load(`StoryImages/` + node['participant'] + `_` + node['order'] + `.JPG`,
                    (tex) => {
                        tex.needsUpdate = true;
                        sprite.scale.set(12, 12 * tex.image.height / tex.image.width, 1.0);
                    });
                const material = new THREE.SpriteMaterial({ map: imgTexture });
                sprite = new THREE.Sprite(material);

                //sprite.scale.set(imgTexture['image'].width, imgTexture['image'].height);
                return sprite;
            } else if (node['group'] == 2) {
                var geometry;

                switch (stageMode) {
                    case 1: geometry = new THREE.ConeGeometry(8, 15); break;
                    case 2: geometry = new THREE.BoxGeometry(10, 10, 10); break;
                    case 3: geometry = new THREE.SphereGeometry(7); break;
                    default: geometry = new THREE.SphereGeometry(7); break;
                }

                const material = new THREE.MeshLambertMaterial({
                    color: NodeColor(node, 1),
                    transparent: true,
                    opacity: 0.7
                });

                const cube = new THREE.Mesh(geometry, material);
                return cube;
            }
        });
}

function ClearDraw() {

    $('.drawer').drawer('close');
    $(".storyImage").attr("src", ``);
    $(".storyTitle").text("");
    $(".storySubtitle").text("");
    $(".storyText").text("");
}

function updateHighlight() {
    // trigger update of highlighted objects in scene
    Graph
        .nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}

function CodingDrop() {
    stageMode = parseInt(document.getElementById("codingDrop").value);
    restagingMode()
}
document.getElementById("codingDrop").onchange = function () { CodingDrop() };

function CodingCheck() {
    includeOrdered = document.getElementById("codingCheck").checked;
    restagingMode()
}

document.getElementById("codingCheck").onchange = function () { CodingCheck() };

function FillSearchDrop() {
    drop = document.getElementById("searchDrop")
    for (var i in storyNodes) {
        var option = document.createElement("option");
        option.value = storyNodes[i]["id"];
        option.text = storyNodes[i]["id"];
        drop.appendChild(option);
    }
}

function SearchDrop() {
    nodeSearch = document.getElementById("searchDrop").value;
    for (var i in Graph.graphData().nodes) {
        if (Graph.graphData().nodes[i]["id"] == nodeSearch) {
            node = Graph.graphData().nodes[i]
            // Aim at node from outside it
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            Graph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );

            ClearDraw();
            break;
        }
    }
}
document.getElementById("searchDrop").onchange = function () { SearchDrop() };