import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import { Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Typography, Card, CardContent, CardActions } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import PackageIcon from '@mui/icons-material/Inventory'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const TransitCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const Transits = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [transits, setTransits] = useState([
        {
            id: 1,
            packageId: 'PKG-001',
            fromDelivery: 'Delivery Hub A',
            toDelivery: 'Delivery Hub B',
            status: 'In Transit',
            createdAt: '2024-01-15 10:30'
        },
        {
            id: 2,
            packageId: 'PKG-002',
            fromDelivery: 'Delivery Hub B',
            toDelivery: 'Delivery Hub C',
            status: 'Completed',
            createdAt: '2024-01-14 14:20'
        },
        {
            id: 3,
            packageId: 'PKG-003',
            fromDelivery: 'Delivery Hub A',
            toDelivery: 'Delivery Hub D',
            status: 'Pending',
            createdAt: '2024-01-16 09:15'
        }
    ]);

    const [newTransit, setNewTransit] = useState({
        packageId: '',
        fromDelivery: '',
        toDelivery: '',
        notes: ''
    });

    const deliveryHubs = [
        'Delivery Hub A',
        'Delivery Hub B', 
        'Delivery Hub C',
        'Delivery Hub D',
        'Delivery Hub E'
    ];

    const handleCreateTransit = () => {
        if (newTransit.packageId && newTransit.fromDelivery && newTransit.toDelivery) {
            const transit = {
                id: transits.length + 1,
                ...newTransit,
                status: 'Pending',
                createdAt: new Date().toLocaleString()
            };
            setTransits([...transits, transit]);
            setNewTransit({ packageId: '', fromDelivery: '', toDelivery: '', notes: '' });
            setOpenDialog(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'In Transit': return 'info';
            case 'Completed': return 'success';
            default: return 'default';
        }
    };

    const updateTransitStatus = (transitId, newStatus) => {
        setTransits(transits.map(transit => 
            transit.id === transitId ? { ...transit, status: newStatus } : transit
        ));
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <Breadcrumbs separator={<ExpandMoreIcon fontSize="small" />} aria-label="breadcrumb">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Home"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            label="Package Transits"
                            icon={<SwapHorizIcon fontSize="small" />}
                        />
                    </Breadcrumbs>

                    <Item>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalShippingIcon /> Package Transits
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpenDialog(true)}
                                startIcon={<PackageIcon />}
                            >
                                Create Transit
                            </Button>
                        </Box>

                        <Stack spacing={2}>
                            {transits.map((transit) => (
                                <TransitCard key={transit.id}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" component="h3">
                                                Package: {transit.packageId}
                                            </Typography>
                                            <Chip 
                                                label={transit.status} 
                                                color={getStatusColor(transit.status)}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                From: <strong>{transit.fromDelivery}</strong>
                                            </Typography>
                                            <SwapHorizIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                To: <strong>{transit.toDelivery}</strong>
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="caption" color="text.secondary">
                                            Created: {transit.createdAt}
                                        </Typography>
                                    </CardContent>
                                    
                                    <CardActions>
                                        {transit.status === 'Pending' && (
                                            <Button 
                                                size="small" 
                                                onClick={() => updateTransitStatus(transit.id, 'In Transit')}
                                            >
                                                Start Transit
                                            </Button>
                                        )}
                                        {transit.status === 'In Transit' && (
                                            <Button 
                                                size="small" 
                                                onClick={() => updateTransitStatus(transit.id, 'Completed')}
                                            >
                                                Mark Complete
                                            </Button>
                                        )}
                                        <Button size="small" color="primary">
                                            View Details
                                        </Button>
                                    </CardActions>
                                </TransitCard>
                            ))}
                        </Stack>
                    </Item>
                </Stack>
            </Box>

            {/* Create Transit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Package Transit</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Package ID"
                            value={newTransit.packageId}
                            onChange={(e) => setNewTransit({ ...newTransit, packageId: e.target.value })}
                            fullWidth
                            required
                        />
                        
                        <FormControl fullWidth required>
                            <InputLabel>From Delivery Hub</InputLabel>
                            <Select
                                value={newTransit.fromDelivery}
                                label="From Delivery Hub"
                                onChange={(e) => setNewTransit({ ...newTransit, fromDelivery: e.target.value })}
                            >
                                {deliveryHubs.map((hub) => (
                                    <MenuItem key={hub} value={hub}>{hub}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>To Delivery Hub</InputLabel>
                            <Select
                                value={newTransit.toDelivery}
                                label="To Delivery Hub"
                                onChange={(e) => setNewTransit({ ...newTransit, toDelivery: e.target.value })}
                            >
                                {deliveryHubs.filter(hub => hub !== newTransit.fromDelivery).map((hub) => (
                                    <MenuItem key={hub} value={hub}>{hub}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Notes (Optional)"
                            value={newTransit.notes}
                            onChange={(e) => setNewTransit({ ...newTransit, notes: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleCreateTransit} 
                        variant="contained"
                        disabled={!newTransit.packageId || !newTransit.fromDelivery || !newTransit.toDelivery}
                    >
                        Create Transit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Transits;