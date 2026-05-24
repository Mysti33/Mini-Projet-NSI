// ============================================================
// Quiz
// ============================================================

const quizData = {
	'langage': {
		questions: ['project', 'environment', 'syntax'],
		recommendations: [
			{
				criteria: (answers) => answers.project === 'Site Web' && answers.syntax === 'Simple',
				result: { name: 'JavaScript', description: 'Parfait pour les sites web interactifs avec une syntaxe moderne et lisible.' }
			},
			{
				criteria: (answers) => answers.project === 'Analyse de données',
				result: { name: 'Python', description: 'Le langage incontournable pour l\'analyse de données et le machine learning.' }
			},
			{
				criteria: (answers) => answers.project === 'Jeu',
				result: { name: 'C#', description: 'Excellente pour les jeux avec Unity, très performant et facile à apprendre.' }
			},
			{
				criteria: (answers) => answers.syntax === 'Rapide',
				result: { name: 'C++', description: 'Pour les performances extrêmes et le contrôle bas niveau.' }
			}
		]
	},
	'ide': {
		questions: ['language', 'platform', 'level'],
		recommendations: [
            {
				criteria: (answers) => answers.platform === 'Mobile' || (answers.language && answers.language.includes('Mobile')),
				result: { name: 'Acode', description: 'L\'IDE parfait pour coder sur mobile.' }
			},
			{
				criteria: (answers) => answers.language && answers.language.includes('JavaScript'),
				result: { name: 'Visual Studio Code', description: 'L\'IDE parfait pour JavaScript avec d\'excellentes extensions.' }
			},
			{
				criteria: (answers) => answers.language && answers.language.includes('Python'),
				result: { name: 'Thonny', description: 'IDE spécialisé pour Python avec tous les outils intégrés.' }
			},
			{
				criteria: (answers) => answers.level === 'Novice',
				result: { name: 'Visual Studio Code', description: 'Léger et facile à prendre en main pour débuter.' }
			},
			{
				criteria: (answers) => answers.level === 'Pro',
				result: { name: 'JetBrains IDE', description: 'Puissant avec tous les outils avancés pour les pros.' }
			}
		]
	},
	'outil': {
		questions: ['workplace', 'project-type', 'experience'],
		recommendations: [
			{
				criteria: (answers) => answers.workplace === 'Simple' && answers.experience === 'Débutant',
				result: { name: 'Notepad++', description: 'Simple, léger et efficace pour débuter.' }
			},
			{
				criteria: (answers) => answers.workplace === 'Collaboration',
				result: { name: 'Visual Studio Code', description: 'Excellent pour la collaboration avec Live Share.' }
			},
			{
				criteria: (answers) => answers.experience === 'Expert',
				result: { name: 'Vim/Neovim', description: 'L\'outil ultime pour les experts cherchant la puissance et la personnalisation.' }
			},
			{
				criteria: (answers) => answers.workplace === 'Avancé',
				result: { name: 'IntelliJ IDEA', description: 'IDE complet avec toutes les fonctionnalités avancées.' }
			},
			{
				criteria: (answers) => answers['project-type'] && answers['project-type'].includes('Web'),
				result: { name: 'Visual Studio Code', description: 'Le choix idéal pour le développement web moderne.' }
			},
			{
				criteria: (answers) => answers.experience === 'Débutant',
				result: { name: 'Visual Studio Code', description: 'Facile à prendre en main pour les débutants.' }
			}
		]
	},
	'domaine': {
		questions: ['preference', 'universe', 'pace'],
		recommendations: [
			{
				criteria: (answers) => answers.universe === 'Web',
				result: { name: 'Développeur Web Full-Stack', description: 'Spécialiste du développement web couvrant frontend et backend.' }
			},
			{
				criteria: (answers) => answers.universe === 'Données',
				result: { name: 'Data Scientist', description: 'Expert en analyse et traitement de données avec machine learning.' }
			},
			{
				criteria: (answers) => answers.universe === 'Système',
				result: { name: 'Ingénieur Système et Infrastructure', description: 'Expert en optimisation des systèmes et performances.' }
			},
			{
				criteria: (answers) => answers.preference === 'Créer' && answers.pace === 'Rapide',
				result: { name: 'Développeur Frontend Créatif', description: 'Créateur d\'interfaces modernes et réactives avec cycles courts.' }
			},
			{
				criteria: (answers) => answers.preference === 'Analyser' && answers.universe === 'Données',
				result: { name: 'Analyste de Données Senior', description: 'Expert en extraction et analyse de données pour la décision.' }
			},
			{
				criteria: (answers) => answers.pace === 'Long',
				result: { name: 'Architecte Logiciel', description: 'Responsable de la conception et l\'architecture de projets complexes.' }
			}
		]
	}
};

// ============================================================
// Traitement réponses quiz
// ============================================================

function handleQuizSubmit(event) {
	event.preventDefault();

	// Récupérer le type de quiz depuis le nom du fichier ou une classe
	const form = event.target;
	const filePath = window.location.pathname;
	const quizType = filePath.match(/quiz-(\w+)/)[1];

	// Récupérer toutes les réponses du formulaire
	const formData = new FormData(form);
	const answers = {};

	// Traiter les réponses
	const radioInputs = form.querySelectorAll('input[type="radio"]:checked');
	const checkboxInputs = form.querySelectorAll('input[type="checkbox"]:checked');

	// Ajouter les radio buttons
	radioInputs.forEach(input => {
		answers[input.name] = input.value;
	});

	// Ajouter les checkboxes en tableau
	const checkboxNames = new Set();
	checkboxInputs.forEach(input => {
		checkboxNames.add(input.name);
	});

	checkboxNames.forEach(name => {
		answers[name] = Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
			.map(input => input.value);
	});

	// Trouver la meilleure recommandation
	const quizConfig = quizData[quizType];
	let bestMatch = null;
	let matchScore = -1;

	quizConfig.recommendations.forEach(recommendation => {
		if (recommendation.criteria(answers)) {
			// Donner un meilleur score aux critères plus spécifiques
			const score = Object.keys(answers).length;
			if (score > matchScore) {
				matchScore = score;
				bestMatch = recommendation.result;
			} else if (score === matchScore && !bestMatch) {
				bestMatch = recommendation.result;
			} else if (score === matchScore) {
				// Si même score, garder la première trouvée
				if (!bestMatch) {
					bestMatch = recommendation.result;
				}
			}
		}
	});

	// Afficher le résultat
	displayQuizResult(bestMatch, quizType);
}

// ============================================================
// Affichage du résultat du quiz
// ============================================================

function displayQuizResult(result, quizType) {
	// Créer ou obtenir le conteneur de résultat
	let resultContainer = document.querySelector('.quiz-result');
	if (!resultContainer) {
		resultContainer = document.createElement('div');
		resultContainer.className = 'quiz-result';
		const form = document.querySelector('.quiz-form');
		form.parentNode.insertBefore(resultContainer, form.nextSibling);
	}

	// Remplir le conteneur avec le résultat
	resultContainer.innerHTML = `
		<div class="result-card">
			<h3>🎯 Résultat :</h3>
			<h2>${result.name}</h2>
			<p>${result.description}</p>
			<button class="btn-reset" onclick="location.reload()">Recommencer le quiz</button>
		</div>
	`;

	// Scroller jusqu'au résultat
	resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// Gestion du formulaire de contact
// ============================================================

function handleContactSubmit(event) {
	event.preventDefault();

	const form = event.target;
	const formData = new FormData(form);
	const contactData = {
		name: formData.get('name'),
		email: formData.get('email'),
		subject: formData.get('subject'),
		message: formData.get('message'),
		timestamp: new Date().toLocaleString('fr-FR')
	};

	// Valider les données
	if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
		alert('⚠️ Tous les champs sont obligatoires !');
		return;
	}

	if (!isValidEmail(contactData.email)) {
		alert('⚠️ Veuillez entrer une adresse email valide !');
		return;
	}

	// Sauvegarder en localStorage
	saveContactMessage(contactData);

	// Afficher une confirmation
	showContactSuccess();

	// Réinitialiser le formulaire
	form.reset();
}

// ============================================================
// Utilitaires Contacts
// ============================================================

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function saveContactMessage(data) {
	// Récupérer les messages existants
	let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];

	// Ajouter le nouveau message
	messages.push(data);

	// Sauvegarder dans localStorage
	localStorage.setItem('contactMessages', JSON.stringify(messages));

	console.log('Message sauvegardé:', data);
	console.log('Tous les messages:', messages);
}

function showContactSuccess() {
	// Créer le message de succès
	const successMessage = document.createElement('div');
	successMessage.className = 'success-message';
	successMessage.innerHTML = `
		<div class="success-card">
			<h3>✅ Message envoyé avec succès !</h3>
			<p>Merci de nous avoir contacté. Nous vous répondrons rapidement.</p>
		</div>
	`;

	// Insérer après le formulaire
	const form = document.querySelector('.contact-form');
	form.parentNode.insertBefore(successMessage, form.nextSibling);

	// Enlever le message après 5 secondes
	setTimeout(() => {
		successMessage.remove();
	}, 5000);
}

// ============================================================
// Obtenir les données (Constact) et affichage dans la console
// ============================================================

function getAllContactMessages() {
	const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
	return messages;
}

function viewAllMessages() {
	const messages = getAllContactMessages();
	console.log('=== TOUS LES MESSAGES DE CONTACT ===');
	console.table(messages);
	return messages;
}

function exportMessagesAsJSON() {
	const messages = getAllContactMessages();
	const dataStr = JSON.stringify(messages, null, 2);
	const dataBlob = new Blob([dataStr], { type: 'application/json' });
	const url = URL.createObjectURL(dataBlob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'messages-contact.json';
	link.click();
}

// ============================================================
// Listener
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
	// Attacher le handler au formulaire de quiz
	const quizForm = document.querySelector('.quiz-form');
	if (quizForm) {
		quizForm.addEventListener('submit', handleQuizSubmit);
	}

	// Attacher le handler au formulaire de contact
	const contactForm = document.querySelector('.contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', handleContactSubmit);
	}
});
