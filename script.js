const state = {
    alunos: [],
    grafico: null
};

// inicializa o gráfico vazio
const initChart = () => {
    const ctx = document.getElementById("grafico").getContext("2d");
    state.grafico = new Chart(ctx, {
        type: "bar", // tipo de gráfico
        data: {
            labels: [],
            datasets: [{
                label: "Média Final",
                data: [],
                backgroundColor: [], 
                borderRadius: 8,    // arrendodnorar
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 10, 
                    grid: { color: "#334155" },
                    ticks: { color: "#94a3b8" }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: "#94a3b8" }
                }
            },
            plugins: { 
                legend: { display: false } 
            }
        }
    });
};

const render = () => {
    const tabela = document.getElementById("corpoTabela");
    const listaNomes = [];
    const listaMedias = [];
    const listaCores = [];

    tabela.innerHTML = state.alunos.map((aluno, index) => {
        const media = ((aluno.n1 + aluno.n2 + aluno.n3) / 3).toFixed(1);
        const config = getStatusConfig(media);

        // guarda os nome para os dados 
        listaNomes.push(aluno.nome);
        listaMedias.push(media);
        listaCores.push(config.hex); 

        return `
            <tr>
                <td><strong>${aluno.nome}</strong></td>
                <td>${aluno.n1}</td>
                <td>${aluno.n2}</td>
                <td>${aluno.n3}</td>
                <td>${media}</td>
                <td><span class="status-badge" style="background: ${config.bg}; color: #30a53c">${config.text}</span></td>
                <td>
                    <button onclick="editar(${index})" class="btn-icon" style="background: #334155">Editar</button>
                    <button onclick="excluir(${index})" class="btn-icon" style="background: var(--danger)">Excluir</button>
                </td>
            </tr>
        `;
    }).join("");

    updateChart(listaNomes, listaMedias, listaCores);
};

const getStatusConfig = (media) => {
    if (media >= 7) return { text: "Aprovado", bg: "var(--success)", hex: "#22c55e" };
    if (media >= 5) return { text: "Recuperação", bg: "var(--warning)", hex: "#f59e0b" };
    return { text: "Reprovado", bg: "var(--danger)", hex: "#ef4444" };
};

const updateChart = (nomes, medias, cores) => {
    state.grafico.data.labels = nomes;
    state.grafico.data.datasets[0].data = medias;
    state.grafico.data.datasets[0].backgroundColor = cores;
    state.grafico.update();
};

//apagar editar e enviar
document.getElementById("formAluno").addEventListener("submit", (e) => {
    e.preventDefault();
    const novoAluno = {
        id: Date.now(),
        nome: document.getElementById("nome").value,
        n1: Number(document.getElementById("nota1").value),
        n2: Number(document.getElementById("nota2").value),
        n3: Number(document.getElementById("nota3").value)
    };
    state.alunos.push(novoAluno);
    render();
    e.target.reset();
});

window.excluir = (index) => {
    state.alunos.splice(index, 1);
    render();
};

window.editar = (index) => {
    const a = state.alunos[index];
    const n = prompt("Novo nome:", a.nome);
    if (n) {
        state.alunos[index] = {
            ...a,
            nome: n,
            n1: Number(prompt("Nota 1:", a.n1)),
            n2: Number(prompt("Nota 2:", a.n2)),
            n3: Number(prompt("Nota 3:", a.n3))
        };
        render();
    }
};

initChart();