

document.getElementById('extract').addEventListener('click', () => {
	// Get the current active tab in the window
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	  if (tabs.length > 0) {
		const tabId = tabs[0].id; // Get the ID of the active tab
		chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                files: ['libs/xlsx.mini.min.js'],
            },
            () => {
		chrome.scripting.executeScript(
		  {
			target: { tabId: tabId, allFrames: true }, // Use the valid tabId here
			func: function() {
				function extractAndDownload() {
				console.log("Extracting...");
				const productContainers = document.querySelectorAll('[data-testid="itemtile-stack"]');
				const data = [];

				productContainers.forEach(container => {
					const nameElem = container.querySelector('[data-testid="productName"] span');
					const qtyElem = container.querySelector('[data-testid="itemtile-stack"] .bill-item-quantity');
					const priceElem = container.querySelector('[data-testid="line-price"] span');

					const productName = nameElem ? nameElem.textContent.trim() : null;
					const quantity = qtyElem ? qtyElem.textContent.replace('Qty', '').trim() : null;
					const price = priceElem ? priceElem.textContent.trim() : null;

					if (productName && quantity && price) {
						data.push({ Product: productName, Quantity: quantity, Price: price });
					}
				});

				console.log("Extracted data:", data);
					if (data.length > 0) {
					  // Create an Excel file
					  const wb = XLSX.utils.book_new();
					  const ws = XLSX.utils.json_to_sheet(data);
					  XLSX.utils.book_append_sheet(wb, ws, 'ExtractedData');
				  
					  // Generate and trigger download
					  XLSX.writeFile(wb, 'ExtractedData.xlsx');
					} else {
					  alert('No data found to extract!');
					}
				  }
				extractAndDownload()
			},
		  },
		  () => console.log('Data extraction script executed')
		);
		}
		)
	  } else {
		console.error('No active tab found!');
	  }
	});
  });
  

  